import { useState, type FormEvent, type FocusEvent } from 'react'
import './SignUpForm.css'

function validateEmail(email: string): string | undefined {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address'
}

function validatePassword(password: string): string | undefined {
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/\d/.test(password)) return 'Password must contain at least one number'
}

interface SignUpFormProps {
  onSubmit?: (data: { email: string; password: string }) => void
}

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Errors are revealed when the user leaves (blurs) a field or submits the form
  const [emailError, setEmailError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()

  const [submitted, setSubmitted] = useState(false)

  const isValid = !validateEmail(email) && !validatePassword(password)

  function handleEmailBlur(e: FocusEvent<HTMLInputElement>) {
    setEmailError(validateEmail(e.target.value))
  }

  function handlePasswordBlur(e: FocusEvent<HTMLInputElement>) {
    setPasswordError(validatePassword(e.target.value))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isValid) {
      setSubmitted(true)
      onSubmit?.({ email, password })
    }
  }

  if (submitted) {
    return (
      <p role="status" className="signup-success">
        Sign up successful!
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Sign up form"
      className="signup-card"
    >
      <h1 className="signup-card__title">Create your account</h1>
      <p className="signup-card__subtitle">Sign up to get started</p>

      <div className="signup-field">
        <label htmlFor="email" className="signup-field__label">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            // Re-validate live once the user has already seen an error
            if (emailError !== undefined) setEmailError(validateEmail(e.target.value))
          }}
          onBlur={handleEmailBlur}
          aria-describedby={emailError ? 'email-error' : undefined}
          aria-invalid={emailError ? true : undefined}
          className={
            'signup-field__input' +
            (emailError ? ' signup-field__input--invalid' : '')
          }
        />
        {emailError && (
          <span id="email-error" role="alert" className="signup-field__error">
            {emailError}
          </span>
        )}
      </div>

      <div className="signup-field">
        <label htmlFor="password" className="signup-field__label">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters with a number"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError !== undefined) setPasswordError(validatePassword(e.target.value))
          }}
          onBlur={handlePasswordBlur}
          aria-describedby={passwordError ? 'password-error' : undefined}
          aria-invalid={passwordError ? true : undefined}
          className={
            'signup-field__input' +
            (passwordError ? ' signup-field__input--invalid' : '')
          }
        />
        {passwordError && (
          <span id="password-error" role="alert" className="signup-field__error">
            {passwordError}
          </span>
        )}
      </div>

      <button type="submit" disabled={!isValid} className="signup-card__submit">
        Sign Up
      </button>
    </form>
  )
}
