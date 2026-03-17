'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const page = event.page || 1;
  const pageSize = event.pageSize || 10;
  try {
    const dbCmd = db.command;
    const where = dbCmd.or([
      { status: 'active' },
      { status: dbCmd.exists(false) }
    ]);
    const countRes = await db
      .collection('activities')
      .where(where)
      .count();
    const total = countRes.total || 0;
    const skip = (page - 1) * pageSize;
    const listRes = await db
      .collection('activities')
      .where(where)
      .orderBy('created_at', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();
    return {
      code: 0,
      data: listRes.data || [],
      total
    };
  } catch (e) {
    return { code: -1, msg: e.message || '获取失败' };
  }
};
