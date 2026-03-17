'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { date, token } = event;
  if (!token) {
    return { code: 401, msg: '未登录' };
  }
  if (!date) {
    return { code: -1, msg: 'date不能为空' };
  }
  const userRes = await db
    .collection('uni-id-users')
    .where({ 'token.token': token })
    .limit(1)
    .field({ _id: true })
    .get();
  if (!userRes.data || !userRes.data.length) {
    return { code: 401, msg: '未登录' };
  }
  const userId = userRes.data[0]._id;
  try {
    const recordsRes = await db
      .collection('study-records')
      .where({
        user_id: userId,
        date: date
      })
      .limit(100)
      .get();
    return { code: 0, data: recordsRes.data || [] };
  } catch (e) {
    return { code: -1, msg: e.message || '获取失败' };
  }
};
