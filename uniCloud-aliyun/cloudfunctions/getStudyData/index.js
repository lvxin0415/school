'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { uid } = context.auth || {}
  if (!uid) return { code: -1, msg: '请先登录' }

  try {
    const userRes = await db.collection('uni-id-users').doc(uid).field({ points: true }).get()
    const points = userRes.data[0]?.points || 0

    const recordsRes = await db.collection('study-records')
      .where({ user_id: uid })
      .orderBy('created_at', 'desc')
      .limit(200)
      .get()
    const records = recordsRes.data || []

    const totalMinutes = records.reduce((s, r) => s + (r.duration_min || 0), 0)
    const totalDays = [...new Set(records.map(r => r.date))].length

    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      if (records.some(r => r.date === ds)) {
        streak++
      } else {
        break
      }
    }

    return {
      code: 0,
      data: { points, totalMinutes, totalDays, streak, records }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
