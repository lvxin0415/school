'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { id } = event
  if (!id) return { code: -1, msg: '缺少帖子ID' }

  try {
    const postRes = await db.collection('posts').doc(id).get()
    if (!postRes.data || postRes.data.length === 0) {
      return { code: -1, msg: '帖子不存在' }
    }

    const commentRes = await db.collection('comments')
      .where({ post_id: id })
      .orderBy('created_at', 'asc')
      .limit(100)
      .get()

    return {
      code: 0,
      data: {
        post: postRes.data[0],
        comments: commentRes.data
      }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
