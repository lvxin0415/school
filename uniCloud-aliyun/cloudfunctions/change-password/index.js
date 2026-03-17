'use strict'
const db = uniCloud.database()
const crypto = require('crypto')

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex')
}

exports.main = async (event, context) => {
  const { oldPassword, newPassword, token } = event
  if (!oldPassword || !newPassword || !token) {
    return { code: -1, msg: '参数不完整' }
  }

  try {
    const userRes = await db.collection('uni-id-users')
      .where({ 'token.token': token })
      .limit(1)
      .field({ _id: true, password: true })
      .get()

    if (!userRes.data || !userRes.data.length) {
      return { code: 401, msg: '未登录' }
    }

    const user = userRes.data[0]
    const userId = user._id

    if (user.password !== hashPassword(oldPassword)) {
      return { code: -1, msg: '原密码错误' }
    }

    await db.collection('uni-id-users').doc(userId).update({
      password: hashPassword(newPassword)
    })

    return { code: 0, msg: '密码修改成功' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
