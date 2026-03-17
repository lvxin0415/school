'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { keyword = '', page = 1, pageSize = 20 } = event

  try {
    let where = {}
    if (keyword) {
      where = db.command.or([
        { username: new RegExp(keyword, 'i') },
        { nickname: new RegExp(keyword, 'i') }
      ])
    }

    const skip = (page - 1) * pageSize
    const countRes = await db.collection('uni-id-users').where(where).count()
    const res = await db.collection('uni-id-users')
      .where(where)
      .field({ password: false, token: false })
      .orderBy('register_date', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return { code: 0, data: res.data, total: countRes.total }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
