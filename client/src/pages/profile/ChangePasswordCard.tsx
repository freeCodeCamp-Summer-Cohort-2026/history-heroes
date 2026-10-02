import type { UseFormReturn } from 'react-hook-form'
import Button from '../../components/Button'
import Card from '../../components/Card'
import PasswordField from '../../components/PasswordField'
import type { ChangePasswordFormData } from '../useProfile'

interface ChangePasswordCardProps {
  passwordForm: UseFormReturn<ChangePasswordFormData>
  passwordSuccess: string | null
  passwordError: string | null
  newPasswordValue: string
  onChangePassword: (data: ChangePasswordFormData) => void
}

/**
 * ChangePasswordCard renders a form allowing authenticated users to securely update
 * their account password with validation checks (minimum length, confirmation match).
 *
 * How it is used:
 * Rendered on `ProfilePage` for logged-in users. It binds to the react-hook-form instance
 * returned by `useProfile()`, validates user input before submission, triggers
 * `onChangePassword`, and displays feedback alerts upon success or error.
 *
 * When it is shown:
 * Displayed exclusively for authenticated users on the `ProfilePage`.
 */
export default function ChangePasswordCard({
  passwordForm,
  passwordSuccess,
  passwordError,
  newPasswordValue,
  onChangePassword,
}: ChangePasswordCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = passwordForm

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onChangePassword)}
        noValidate
      >
        <h2 className="text-xl font-semibold">Change Password</h2>

        {passwordSuccess && (
          <div role="alert" className="alert alert-success text-sm">
            <span>{passwordSuccess}</span>
          </div>
        )}
        {passwordError && (
          <div role="alert" className="alert alert-error text-sm">
            <span>{passwordError}</span>
          </div>
        )}

        <PasswordField
          id="currentPassword"
          label="Current Password"
          autoComplete="current-password"
          className={errors.currentPassword ? 'input-error' : ''}
          requiredError={
            errors.currentPassword?.type === 'required'
              ? errors.currentPassword.message
              : undefined
          }
          validationError={
            errors.currentPassword && errors.currentPassword.type !== 'required'
              ? errors.currentPassword.message
              : undefined
          }
          {...register('currentPassword', {
            required: 'Current password is required',
          })}
        />

        <PasswordField
          id="newPassword"
          label="New Password"
          autoComplete="new-password"
          className={errors.newPassword ? 'input-error' : ''}
          requiredError={
            errors.newPassword?.type === 'required'
              ? errors.newPassword.message
              : undefined
          }
          validationError={
            errors.newPassword && errors.newPassword.type !== 'required'
              ? errors.newPassword.message
              : undefined
          }
          {...register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />

        <PasswordField
          id="confirmNewPassword"
          label="Confirm New Password"
          autoComplete="new-password"
          className={errors.confirmNewPassword ? 'input-error' : ''}
          requiredError={
            errors.confirmNewPassword?.type === 'required'
              ? errors.confirmNewPassword.message
              : undefined
          }
          validationError={
            errors.confirmNewPassword &&
            errors.confirmNewPassword.type !== 'required'
              ? errors.confirmNewPassword.message
              : undefined
          }
          {...register('confirmNewPassword', {
            required: 'Please confirm your new password',
            validate: (value) =>
              value === newPasswordValue || 'Passwords do not match',
          })}
        />

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
