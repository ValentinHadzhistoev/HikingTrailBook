import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import useForm from '../hooks/useForm'

const emailPattern = /^\S+@\S+\.\S+$/

function validate({ email, password }) {
  if (!emailPattern.test(email)) return 'Please enter a valid email address.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  return ''
}

export default function Login() {
  const { loginHandler } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (values) => {
    const validationError = validate(values)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setLoading(true)
    try {
      await loginHandler(values.email, values.password)
      navigate('/trails')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const { values, changeHandler, submitHandler } = useForm({ email: '', password: '' }, onSubmit)

  return (
    <section className="container page">
      <form className="form" onSubmit={submitHandler}>
        <h1>Login</h1>

        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={changeHandler}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={changeHandler}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="form-note">
          No account yet? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  )
}