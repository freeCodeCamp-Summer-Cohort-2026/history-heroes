import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { useAuth } from '../state/auth/use-auth'
import { resetProgress } from '../features/progress/model/api'

export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

/**
 * useProfile encapsulates all business logic, modal visibility states,
 * form controllers, and asynchronous mutations utilized by the `ProfilePage`.
 *
 * How it is used:
 * Invoked at the top level of `ProfilePage`. It returns the active `user`, loading states,
 * password form controller (`react-hook-form`), action handlers (`onLogout`, `onToggleAuthor`,
 * `onChangePassword`, `handleConfirmResetProgress`, `handleConfirmDeleteAccount`), and
 * modal state controllers.
 *
 * When it is shown:
 * Active whenever the `ProfilePage` component is mounted.
 */
export function useProfile() {
  const {
    user,
    handleLogout,
    loading,
    updateContentAuthor,
    changePassword,
    deleteAccount,
  } = useAuth()
  const navigate = useNavigate()

  const [logoutError, setLogoutError] = useState<string | null>(null)

  // Content Author state
  const [authorLoading, setAuthorLoading] = useState(false)
  const [authorSuccess, setAuthorSuccess] = useState<string | null>(null)
  const [authorError, setAuthorError] = useState<string | null>(null)

  // Change Password state
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Reset Progress state
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)

  // Delete Account state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const passwordForm = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const newPasswordValue = useWatch({
    control: passwordForm.control,
    name: 'newPassword',
  })

  const onLogout = async () => {
    try {
      await handleLogout()
    } catch (err) {
      setLogoutError(err instanceof Error ? err.message : 'Failed to logout')
    }
  }

  const onToggleAuthor = async (newChecked: boolean) => {
    setAuthorLoading(true)
    setAuthorSuccess(null)
    setAuthorError(null)
    try {
      if (updateContentAuthor) {
        await updateContentAuthor(newChecked)
      }
      setAuthorSuccess(
        newChecked
          ? 'Content author permissions enabled'
          : 'Content author permissions disabled',
      )
    } catch (err) {
      setAuthorError(
        err instanceof Error
          ? err.message
          : 'Failed to update content author status',
      )
    } finally {
      setAuthorLoading(false)
    }
  }

  const onChangePassword = async (data: ChangePasswordFormData) => {
    setPasswordSuccess(null)
    setPasswordError(null)
    try {
      if (changePassword) {
        await changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      }
      setPasswordSuccess('Password changed successfully')
      passwordForm.reset()
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'Failed to change password',
      )
    }
  }

  const openResetModal = () => {
    setResetSuccess(null)
    setResetError(null)
    setShowResetModal(true)
  }

  const closeResetModal = () => {
    if (!resetLoading) {
      setShowResetModal(false)
    }
  }

  const handleConfirmResetProgress = async () => {
    setResetLoading(true)
    setResetError(null)
    setResetSuccess(null)
    try {
      await resetProgress()
      setResetSuccess('Progress has been successfully reset.')
      setShowResetModal(false)
    } catch (err) {
      setResetError(
        err instanceof Error ? err.message : 'Failed to reset progress',
      )
    } finally {
      setResetLoading(false)
    }
  }

  const openDeleteModal = () => {
    setDeleteError(null)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    if (!deleteLoading) {
      setShowDeleteModal(false)
    }
  }

  const handleConfirmDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      if (deleteAccount) {
        await deleteAccount()
      }
      setShowDeleteModal(false)
      navigate('/', { replace: true })
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete account',
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  return {
    user,
    loading,
    logoutError,
    onLogout,
    // Content Author
    authorLoading,
    authorSuccess,
    authorError,
    onToggleAuthor,
    // Change Password
    passwordSuccess,
    passwordError,
    passwordForm,
    newPasswordValue,
    onChangePassword,
    // Reset Progress
    showResetModal,
    resetLoading,
    resetSuccess,
    resetError,
    openResetModal,
    closeResetModal,
    handleConfirmResetProgress,
    // Delete Account
    showDeleteModal,
    deleteLoading,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDeleteAccount,
  }
}
