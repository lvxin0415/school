'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { keyword } = event;
  if (!keyword || typeof keyword !== 'string') {
    return { code: -1, msg: 'keyword不能为空' };
  }
  try {
    const postsRes = await db
      .collection('posts')
      .where({
        status: 'approved',
        content: new RegExp(keyword, 'i')
      })
      .orderBy('created_at', 'desc')
      .limit(50)
      .get();
    return { code: 0, data: postsRes.data || [] };
  } catch (e) {
    return { code: -1, msg: e.message || '搜索失败' };
  }
};
