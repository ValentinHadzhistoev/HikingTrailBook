import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import * as commentsApi from '../api/comments'

export default function Comments({ trailId }) {
  const { isAuthenticated, email } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let ignore = false

    commentsApi
      .getForTrail(trailId)
      .then((result) => {
        if (!ignore) setComments(result)
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Could not load comments.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [trailId])

  const submitHandler = async (e) => {
    e.preventDefault()

    if (text.trim().length < 2) {
      setError('Comment must be at least 2 characters.')
      return
    }

    setError('')
    setSaving(true)
    try {
      const created = await commentsApi.create(trailId, text.trim(), email)
      setComments((state) => [created, ...state])
      setText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="comments">
      <h2>Comments</h2>

      {isAuthenticated && (
        <form onSubmit={submitHandler} className="comment-form">
          <textarea
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      )}

      {error && <p className="form-error">{error}</p>}
      {loading && <p className="status-message">Loading comments...</p>}
      {!loading && comments.length === 0 && <p className="status-message">No comments yet.</p>}

      <ul>
        {comments.map((comment) => (
          <li key={comment._id} className="comment">
            <strong>{comment.authorEmail}</strong>
            <p>{comment.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}