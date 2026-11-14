import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import * as likesApi from '../api/likes'

export default function LikeButton({ trailId, ownerId }) {
  const { userId, isAuthenticated } = useAuth()
  const [likes, setLikes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    likesApi
      .getForTrail(trailId)
      .then((result) => {
        if (!ignore) setLikes(result)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })

    return () => {
      ignore = true
    }
  }, [trailId])

  const hasLiked = likes.some((like) => like._ownerId === userId)
  const canLike = isAuthenticated && userId !== ownerId && !hasLiked

  const likeHandler = async () => {
    try {
      const created = await likesApi.like(trailId)
      setLikes((state) => [...state, created])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="likes">
      <span>♥ {likes.length} {likes.length === 1 ? 'like' : 'likes'}</span>

      {canLike && (
        <button type="button" className="btn" onClick={likeHandler}>
          Like
        </button>
      )}

      {hasLiked && <span className="likes-note">You liked this trail</span>}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}