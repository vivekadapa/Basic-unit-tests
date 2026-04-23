import { useState, type FormEvent, type FocusEvent } from 'react'

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
    return <p role="status">Sign up successful!</p>
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Sign up form">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            // Re-validate live once the user has already seen an error
            if (emailError !== undefined) setEmailError(validateEmail(e.target.value))
          }}
          onBlur={handleEmailBlur}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {emailError && (
          <span id="email-error" role="alert">
            {emailError}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError !== undefined) setPasswordError(validatePassword(e.target.value))
          }}
          onBlur={handlePasswordBlur}
          aria-describedby={passwordError ? 'password-error' : undefined}
        />
        {passwordError && (
          <span id="password-error" role="alert">
            {passwordError}
          </span>
        )}
      </div>

      <button type="submit" disabled={!isValid}>
        Sign Up
      </button>
    </form>
  )
}
