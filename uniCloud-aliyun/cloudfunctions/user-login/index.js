'use strict'
const db = uniCloud.database()
const crypto = require('crypto')

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex')
}

exports.main = async (event, context) => {
  const { username, password } = event
  if (!username || !password) return { code: -1, msg: '用户名或密码不能为空' }

  try {
    const res = await db.collection('uni-id-users')
      .where({ username })
      .limit(1)
      .get()

    if (!res.data || res.data.length === 0) {
      return { code: -1, msg: '用户不存在' }
    }

    const user = res.data[0]
    if (user.password !== hashPassword(password)) {
      return { code: -1, msg: '密码错误' }
    }

    if (user.status === 1) {
      return { code: -1, msg: '该账号已被封禁' }
    }

    const token = crypto.randomBytes(32).toString('hex')
    await db.collection('uni-id-users').doc(user._id).update({
      last_login_date: Date.now(),
      token: [{ token, created: Date.now() }]
    })

    return {
      code: 0,
      data: {
        token,
        userInfo: {
          _id: user._id,
          username: user.username,
          nickname: user.nickname || user.username,
          avatar: user.avatar || '',
          role: (user.role || ['user'])[0],
          points: user.points || 0
        }
      }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
