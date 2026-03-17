'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { content, contact, type, images, token } = event;
  if (!content || typeof content !== 'string') {
    return { code: -1, msg: '反馈内容不能为空' };
  }
  if (!token) {
    return { code: 401, msg: '未登录' };
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
    await db.collection('feedback').add({
      user_id: userId,
      content: content,
      contact: contact || '',
      type: type || 'general',
      images: images || [],
      created_at: Date.now(),
      status: 'pending'
    });
    return { code: 0, msg: '反馈提交成功' };
  } catch (e) {
    return { code: -1, msg: e.message || '提交失败' };
  }
};
