'use strict'
const db = uniCloud.database()
const crypto = require('crypto')

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex')
}

exports.main = async (event, context) => {
  const { username, password, nickname } = event
  if (!username || !password) return { code: -1, msg: '用户名或密码不能为空' }
  if (username.length < 3) return { code: -1, msg: '用户名至少3个字符' }
  if (password.length < 6) return { code: -1, msg: '密码至少6位' }

  try {
    const exists = await db.collection('uni-id-users').where({ username }).count()
    if (exists.total > 0) {
      return { code: -1, msg: '用户名已存在' }
    }

    const res = await db.collection('uni-id-users').add({
      username,
      password: hashPassword(password),
      nickname: nickname || username,
      avatar: '',
      role: ['user'],
      status: 0,
      points: 0,
      register_date: Date.now(),
      last_login_date: Date.now(),
      token: []
    })

    return { code: 0, data: { id: res.id }, msg: '注册成功' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
