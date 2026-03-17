'use strict'
const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
  const { page = 1, pageSize = 15, tag, sort = 'latest' } = event

  const where = { status: 'approved' }
  if (tag) {
    where.tags = dbCmd.all([tag])
  }

  const orderBy = sort === 'hot'
    ? 'likes desc, created_at desc'
    : 'created_at desc'

  const skip = (page - 1) * pageSize

  try {
    const countRes = await db.collection('posts').where(where).count()
    const total = countRes.total

    const res = await db.collection('posts')
      .where(where)
      .orderBy(orderBy.split(', ')[0].split(' ')[0], orderBy.split(', ')[0].split(' ')[1])
      .skip(skip)
      .limit(pageSize)
      .get()

    return { code: 0, data: res.data, total }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
