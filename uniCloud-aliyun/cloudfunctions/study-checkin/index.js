'use strict'
const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
  const { duration_min, subject, note = '', token } = event
  if (!token) return { code: 401, msg: '请先登录' }

  const userRes = await db.collection('uni-id-users')
    .where({ 'token.token': token })
    .limit(1)
    .field({ _id: true })
    .get()
  if (!userRes.data || !userRes.data.length) return { code: 401, msg: '请先登录' }
  const uid = userRes.data[0]._id

  if (!duration_min || duration_min < 1) return { code: -1, msg: '学习时长无效' }

  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`

  try {
    await db.collection('study-records').add({
      user_id: uid,
      duration_min,
      subject: subject || '未分类',
      note,
      date: dateStr,
      time_str: timeStr,
      created_at: Date.now()
    })

    let points = 10
    if (duration_min >= 60) points = 15

    await db.collection('uni-id-users').doc(uid).update({
      points: dbCmd.inc(points)
    })

    return { code: 0, data: { points }, msg: '打卡成功' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
