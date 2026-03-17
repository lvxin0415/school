'use strict'
const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
  const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
  if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
  const user = userRes.data[0]
  if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const [todayUsersRes, todayPostsRes, pendingPostsRes, todayStudyRes] = await Promise.all([
      db.collection('uni-id-users').where({ register_date: dbCmd.gte(startOfDay) }).count(),
      db.collection('posts').where({ created_at: dbCmd.gte(startOfDay) }).count(),
      db.collection('posts').where({ status: 'pending' }).count(),
      db.collection('study-records').where({ date: dateStr }).limit(500).field({ duration_min: true }).get()
    ])

    const todayStudyMinutes = (todayStudyRes.data || []).reduce((s, r) => s + (r.duration_min || 0), 0)
    const todayStudyHours = Math.round(todayStudyMinutes / 60 * 10) / 10

    const trendPromises = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
      const dEnd = dStart + 86400000
      trendPromises.push(
        db.collection('uni-id-users')
          .where({ last_login_date: dbCmd.gte(dStart).and(dbCmd.lt(dEnd)) })
          .count()
      )
    }
    const trendResults = await Promise.all(trendPromises)
    const trend = trendResults.map(r => r.total)

    return {
      code: 0,
      data: {
        todayUsers: todayUsersRes.total,
        todayPosts: todayPostsRes.total,
        pendingPosts: pendingPostsRes.total,
        todayStudyHours
      },
      trend
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
