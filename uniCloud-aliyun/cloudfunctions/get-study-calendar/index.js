'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { year, month, token } = event
  if (!token) {
    return { code: 401, msg: '未登录' }
  }
  if (!year || !month) {
    return { code: -1, msg: 'year 和 month 不能为空' }
  }

  try {
    const userRes = await db.collection('uni-id-users')
      .where({ 'token.token': token })
      .limit(1)
      .field({ _id: true })
      .get()

    if (!userRes.data || !userRes.data.length) {
      return { code: 401, msg: '未登录' }
    }

    const userId = userRes.data[0]._id
    const monthStr = String(month).padStart(2, '0')
    const dateRegex = new RegExp(`^${year}-${monthStr}`)

    const res = await db.collection('study-records')
      .where({
        user_id: userId,
        date: dateRegex
      })
      .field({ date: true, duration_min: true })
      .limit(200)
      .get()

    const data = (res.data || []).map(r => ({
      date: r.date,
      duration_min: r.duration_min || 0
    }))

    return { code: 0, data }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
