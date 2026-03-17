'use strict'
const db = uniCloud.database()
const crypto = require('crypto')

exports.main = async (event, context) => {
  try {
    const res = await db.collection('uni-id-users')
      .where({ username: 'admin' })
      .limit(1)
      .get()

    if (res.data && res.data.length > 0) {
      return { code: 0, msg: '管理员账号已存在', data: { username: 'admin' } }
    }

    const hashedPwd = crypto.createHash('sha256').update('admin123').digest('hex')
    await db.collection('uni-id-users').add({
      username: 'admin',
      password: hashedPwd,
      nickname: '管理员',
      avatar: '',
      role: ['admin'],
      status: 0,
      points: 0,
      register_date: Date.now(),
      last_login_date: Date.now(),
      token: []
    })

    return { code: 0, msg: '管理员账号初始化成功', data: { username: 'admin', password: 'admin123' } }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
