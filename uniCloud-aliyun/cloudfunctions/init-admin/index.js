'use strict'
const db = uniCloud.database()
const crypto = require('crypto')

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex')
}

exports.main = async (event, context) => {
  const { forceReset = false } = event || {}

  try {
    const res = await db.collection('uni-id-users')
      .where({ username: 'admin' })
      .limit(1)
      .get()

    if (res.data && res.data.length > 0) {
      if (forceReset) {
        const admin = res.data[0]
        await db.collection('uni-id-users').doc(admin._id).update({
          password: hashPassword('admin123'),
          status: 0,
          token: []
        })
        return {
          code: 0,
          msg: '管理员密码已重置为admin123',
          data: { username: 'admin', password: 'admin123', forceReset: true }
        }
      }
      return { code: 0, msg: '管理员账号已存在', data: { username: 'admin' } }
    }

    const hashedPwd = hashPassword('admin123')
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
