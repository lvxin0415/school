'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const res = await db.collection('campus-models')
      .orderBy('uploaded_at', 'desc')
      .limit(50)
      .get()
    return { code: 0, data: res.data }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
