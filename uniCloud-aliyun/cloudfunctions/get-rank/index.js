'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { type = 'week' } = event

  try {
    if (type === 'week') {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const weekStartStr = `${weekAgo.getFullYear()}-${String(weekAgo.getMonth() + 1).padStart(2, '0')}-${String(weekAgo.getDate()).padStart(2, '0')}`

      const checkinsRes = await db.collection('study-records')
        .where({ date: db.command.gte(weekStartStr) })
        .limit(2000)
        .get()

      const userMap = {}
      for (const r of checkinsRes.data) {
        const uid = r.user_id
        if (!userMap[uid]) userMap[uid] = 0
        userMap[uid] += r.duration_min || 0
      }

      const userIds = Object.keys(userMap)
      const rankList = []
      if (userIds.length > 0) {
        const usersRes = await db.collection('uni-id-users')
          .where({ _id: db.command.in(userIds) })
          .field({ _id: true, nickname: true, avatar: true })
          .get()

        const userInfoMap = {}
        for (const u of usersRes.data) {
          userInfoMap[u._id] = u
        }

        for (const uid of userIds) {
          const u = userInfoMap[uid] || {}
          rankList.push({
            userId: uid,
            nickname: u.nickname || u.username || '匿名',
            avatar: u.avatar || '',
            value: userMap[uid]
          })
        }
        rankList.sort((a, b) => b.value - a.value)
        rankList.splice(50)
      }

      return { code: 0, data: rankList }
    }

    if (type === 'all') {
      const res = await db.collection('uni-id-users')
        .orderBy('points', 'desc')
        .limit(50)
        .field({ _id: true, nickname: true, avatar: true, points: true })
        .get()

      const rankList = (res.data || []).map(u => ({
        userId: u._id,
        nickname: u.nickname || u.username || '匿名',
        avatar: u.avatar || '',
        value: u.points || 0
      }))

      return { code: 0, data: rankList }
    }

    return { code: -1, msg: 'type 必须为 week 或 all' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
