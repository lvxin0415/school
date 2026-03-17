'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { token } = event;
  if (!token) {
    return { code: 401, msg: 'Token无效' };
  }
  const userRes = await db
    .collection('uni-id-users')
    .where({ 'token.token': token })
    .limit(1)
    .field({
      _id: true,
      username: true,
      nickname: true,
      avatar: true,
      role: true,
      points: true
    })
    .get();
  if (!userRes.data || !userRes.data.length) {
    return { code: 401, msg: 'Token无效' };
  }
  const user = userRes.data[0];
  const role = user.role && user.role.length ? user.role[0] : 'user';
  return {
    code: 0,
    userInfo: {
      _id: user._id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      role,
      points: user.points
    }
  };
};
