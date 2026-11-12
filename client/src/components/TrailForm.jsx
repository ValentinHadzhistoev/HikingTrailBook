import { useState } from 'react'
import useForm from '../hooks/useForm'
import { DIFFICULTIES, validateTrail } from '../utils/validateTrail'

export default function TrailForm({ title, initialValues, submitLabel, onSave }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (formValues) => {
    const validationError = validateTrail(formValues)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setLoading(true)
    try {
      await onSave({ ...formValues, length: Number(formValues.length) })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const { values, changeHandler, submitHandler } = useForm(initialValues, onSubmit)

  return (
    <section className="container page">
      <form className="form" onSubmit={submitHandler}>
        <h1>{title}</h1>

        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Trail name</label>
          <input id="name" name="name" value={values.name} onChange={changeHandler} />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" value={values.location} onChange={changeHandler} />
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" value={values.difficulty} onChange={changeHandler}>
            <option value="">Choose...</option>
            {DIFFICULTIES.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="length">Length (km)</label>
          <input
            id="length"
            name="length"
            type="number"
            step="0.1"
            value={values.length}
            onChange={changeHandler}
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            id="imageUrl"
            name="imageUrl"
            value={values.imageUrl}
            onChange={changeHandler}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={values.description}
            onChange={changeHandler}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </form>
    </section>
  )
}