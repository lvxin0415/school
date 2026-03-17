'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { id } = event;
  if (!id) {
    return { code: -1, msg: 'id不能为空' };
  }
  try {
    const docRes = await db.collection('activities').doc(id).get();
    if (!docRes.data || !docRes.data.length) {
      return { code: -1, msg: '活动不存在' };
    }
    return { code: 0, data: docRes.data[0] };
  } catch (e) {
    return { code: -1, msg: e.message || '获取失败' };
  }
};
