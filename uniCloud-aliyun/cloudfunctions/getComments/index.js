'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { postId } = event;
  if (!postId) {
    return { code: -1, msg: 'postId不能为空' };
  }
  try {
    const commentsRes = await db
      .collection('comments')
      .where({ post_id: postId })
      .orderBy('created_at', 'desc')
      .limit(100)
      .get();
    return { code: 0, data: commentsRes.data || [] };
  } catch (e) {
    return { code: -1, msg: e.message || '获取失败' };
  }
};
