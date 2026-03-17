'use strict'

const db = uniCloud.database()

exports.main = async (event, context) => {
  const { token, id } = event

  if (!token || !id) {
    return { code: -1, msg: '参数缺失' }
  }

  try {
    await db.collection('messages').doc(id).update({ read: true })
    return { code: 0, msg: '已读' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
