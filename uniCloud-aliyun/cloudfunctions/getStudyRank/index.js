'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const now = new Date()
    const dayOfWeek = now.getDay() || 7
    const mondayDate = new Date(now)
    mondayDate.setDate(now.getDate() - dayOfWeek + 1)
    const weekStart = `${mondayDate.getFullYear()}-${String(mondayDate.getMonth()+1).padStart(2,'0')}-${String(mondayDate.getDate()).padStart(2,'0')}`

    const recordsRes = await db.collection('study-records')
      .where({ date: db.command.gte(weekStart) })
      .limit(1000)
      .get()

    const userMap = {}
    for (const r of recordsRes.data) {
      if (!userMap[r.user_id]) userMap[r.user_id] = { duration: 0, days: new Set() }
      userMap[r.user_id].duration += r.duration_min || 0
      userMap[r.user_id].days.add(r.date)
    }

    const userIds = Object.keys(userMap)
    let usersInfo = []
    if (userIds.length > 0) {
      const usersRes = await db.collection('uni-id-users')
        .where({ _id: db.command.in(userIds) })
        .field({ nickname: true, username: true })
        .get()
      usersInfo = usersRes.data
    }

    const nameMap = {}
    for (const u of usersInfo) {
      nameMap[u._id] = u.nickname || u.username || '匿名'
    }

    const colors = ['#94C1D6', '#747CBB', '#B8A2CA', '#E8A87C', '#85C88A', '#F0AD4E']
    const rankList = userIds.map((uid, i) => ({
      user_id: uid,
      name: nameMap[uid] || '匿名',
      duration: userMap[uid].duration,
      streak: userMap[uid].days.size,
      color: colors[i % colors.length]
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 50)

    return { code: 0, data: rankList }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
