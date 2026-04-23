import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SignUpForm from './SignUpForm'

/**
 * Render the form and return typed shortcut accessors.
 * Using accessors (functions) so each call reads the current DOM state.
 */
function setup() {
  render(<SignUpForm />)
  return {
    emailInput: () => screen.getByLabelText(/email/i),
    passwordInput: () => screen.getByLabelText(/password/i),
    submitButton: () => screen.getByRole('button', { name: /sign up/i }),
  }
}

// ---------------------------------------------------------------------------
// Behavior 1 – It should accept valid email input
// ---------------------------------------------------------------------------
describe('Behavior 1 – valid email input is accepted', () => {
  it('does not show an email error after the user types a properly formatted email and blurs', async () => {
    const { emailInput } = setup()
    const user = userEvent.setup()

    await user.type(emailInput(), 'user@example.com')
    await user.tab() // move focus away to trigger blur

    expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Behavior 2 – It should show an error for an invalid email
// ---------------------------------------------------------------------------
describe('Behavior 2 – invalid email triggers an error message', () => {
  it('shows an error when the user types an address without "@" and blurs', async () => {
    const { emailInput } = setup()
    const user = userEvent.setup()

    await user.type(emailInput(), 'notanemail')
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i)
  })

  it('shows "Email is required" when the email field is left empty and blurred', async () => {
    const { emailInput } = setup()
    const user = userEvent.setup()

    await user.click(emailInput())
    await user.tab() // blur without typing

    expect(screen.getByRole('alert')).toHaveTextContent(/email is required/i)
  })
})

// ---------------------------------------------------------------------------
// Behavior 3 – It should reject passwords that are too short
// ---------------------------------------------------------------------------
describe('Behavior 3 – short passwords are rejected', () => {
  it('shows an error when the password has fewer than 8 characters', async () => {
    const { passwordInput } = setup()
    const user = userEvent.setup()

    await user.type(passwordInput(), 'abc1')
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent(/at least 8 characters/i)
  })
})

// ---------------------------------------------------------------------------
// Behavior 4 – It should require a number in the password
// ---------------------------------------------------------------------------
describe('Behavior 4 – password must contain at least one number', () => {
  it('shows an error when the password contains no digits', async () => {
    const { passwordInput } = setup()
    const user = userEvent.setup()

    await user.type(passwordInput(), 'abcdefgh')
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent(/at least one number/i)
  })
})

// ---------------------------------------------------------------------------
// Behavior 5 – It should enable submit only when inputs are valid
// ---------------------------------------------------------------------------
describe('Behavior 5 – submit button reflects overall form validity', () => {
  it('is disabled while either field is invalid', async () => {
    const { emailInput, submitButton } = setup()
    const user = userEvent.setup()

    await user.type(emailInput(), 'notanemail')

    expect(submitButton()).toBeDisabled()
  })

  it('is enabled once both email and password satisfy all rules', async () => {
    const { emailInput, passwordInput, submitButton } = setup()
    const user = userEvent.setup()

    await user.type(emailInput(), 'user@example.com')
    await user.type(passwordInput(), 'secret123')

    expect(submitButton()).toBeEnabled()
  })
})

// ---------------------------------------------------------------------------
// Behavior 6 – It should show an error message when validation fails
// ---------------------------------------------------------------------------
describe('Behavior 6 – error messages surface when validation fails', () => {
  it('shows an email error after leaving an empty email field', async () => {
    const { emailInput } = setup()
    const user = userEvent.setup()

    await user.click(emailInput())
    await user.tab()

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows a password error after leaving an invalid password field', async () => {
    const { passwordInput } = setup()
    const user = userEvent.setup()

    await user.type(passwordInput(), 'short')
    await user.tab()

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows two errors simultaneously when both fields are invalid and blurred', async () => {
    const { emailInput, passwordInput } = setup()
    const user = userEvent.setup()

    await user.click(emailInput())
    await user.tab() // blur email → email error
    await user.type(passwordInput(), 'nope')
    await user.tab() // blur password → password error

    expect(screen.getAllByRole('alert')).toHaveLength(2)
  })
})

// ---------------------------------------------------------------------------
// Behavior 7 – It should submit successfully when all conditions are met
// ---------------------------------------------------------------------------
describe('Behavior 7 – successful submission when all inputs are valid', () => {
  it('calls the onSubmit callback with the entered email and password', async () => {
    const handleSubmit = vi.fn()
    render(<SignUpForm onSubmit={handleSubmit} />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(handleSubmit).toHaveBeenCalledOnce()
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret123',
    })
  })

  it('shows a success status message after a valid submission', async () => {
    render(<SignUpForm />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/sign up successful/i)
  })
})
