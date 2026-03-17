'use strict'

const db = uniCloud.database()

exports.main = async (event, context) => {
  const { token } = event

  if (!token) {
    return { code: 0, totalDays: 0, totalMinutes: 0, streakDays: 0, points: 0, badges: [], weekStats: [] }
  }

  try {
    const userRes = await db.collection('uni-id-users')
      .where({ 'token.token': token })
      .limit(1)
      .field({ _id: true, points: true })
      .get()

    if (!userRes.data || userRes.data.length === 0) {
      return { code: 0, totalDays: 0, totalMinutes: 0, streakDays: 0, points: 0, badges: [], weekStats: [] }
    }

    const userId = userRes.data[0]._id
    const userPoints = userRes.data[0].points || 0

    const checkins = await db.collection('study-records')
      .where({ user_id: userId })
      .orderBy('date', 'desc')
      .limit(100)
      .get()

    const records = checkins.data || []
    const totalDays = records.length
    const totalMinutes = records.reduce((sum, r) => sum + (r.duration_min || 0), 0)

    let streakDays = 0
    if (records.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      let checkDate = new Date(today)

      for (let i = 0; i < records.length; i++) {
        const recDate = new Date(records[i].date)
        recDate.setHours(0, 0, 0, 0)
        if (recDate.getTime() === checkDate.getTime()) {
          streakDays++
          checkDate.setDate(checkDate.getDate() - 1)
        } else if (i === 0 && (today - recDate) <= 86400000) {
          checkDate.setDate(checkDate.getDate() - 1)
          if (recDate.getTime() === checkDate.getTime()) {
            streakDays++
            checkDate.setDate(checkDate.getDate() - 1)
          } else {
            break
          }
        } else {
          break
        }
      }
    }

    const badgesRes = await db.collection('user-badges')
      .where({ user_id: userId })
      .limit(50)
      .get()
      .catch(() => ({ data: [] }))

    const now = new Date()
    const weekStats = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const rec = records.find(r => r.date === dateStr)
      weekStats.push({
        date: dateStr,
        day: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        minutes: rec ? (rec.duration_min || 0) : 0
      })
    }

    return {
      code: 0,
      totalDays,
      totalMinutes,
      streakDays,
      points: userPoints,
      badges: badgesRes.data || [],
      weekStats
    }
  } catch (e) {
    return { code: 0, totalDays: 0, totalMinutes: 0, streakDays: 0, points: 0, badges: [], weekStats: [] }
  }
}
