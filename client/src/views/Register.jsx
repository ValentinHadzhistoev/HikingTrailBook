import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import useForm from '../hooks/useForm'

const emailPattern = /^\S+@\S+\.\S+$/

function validate({ email, password, rePass }) {
  if (!emailPattern.test(email)) return 'Please enter a valid email address.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  if (password !== rePass) return 'Passwords do not match.'
  return ''
}

export default function Register() {
  const { registerHandler } = useAuth()
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
      await registerHandler(values.email, values.password)
      navigate('/trails')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const { values, changeHandler, submitHandler } = useForm(
    { email: '', password: '', rePass: '' },
    onSubmit
  )

  return (
    <section className="container page">
      <form className="form" onSubmit={submitHandler}>
        <h1>Register</h1>

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

        <div className="form-group">
          <label htmlFor="rePass">Repeat password</label>
          <input
            type="password"
            id="rePass"
            name="rePass"
            value={values.rePass}
            onChange={changeHandler}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="form-note">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  )
}