import React, { useState, useContext } from 'react'
import { type DataProvider, type AuthProvider } from 'react-admin'
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Box,
  Typography,
  Modal
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { resetPasswordValidationSchema } from './utils/password-validation.schema'
import { Context as NotificationContext } from './context/NotificationContext'
import * as constants from './constants'
import {
  getErrorDetails,
  // isDateNotInPastDays,
  changeAndUpdatePassword,
  deleteUpdateBefore
} from './utils/helper'
import { type AxiosError, isAxiosError } from 'axios'
import { AuditType } from './utils/activity-types'
import { trackEvent } from './utils/audit'
import { encryptData } from './utils/encryption'

interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  reTypePassword: string
}

interface ChangePasswordModal {
  openChangePasswordModal: boolean
  setOpenChangePasswordModal: React.Dispatch<React.SetStateAction<boolean>>
  authProvider: AuthProvider
  dataProvider: DataProvider
}

const ChangePassword = ({
  openChangePasswordModal,
  setOpenChangePasswordModal,
  authProvider,
  dataProvider
}: ChangePasswordModal): React.ReactElement => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showRetypePassword, setShowRetypePassword] = useState(false)
  const schema = yup.object({
    newPassword: resetPasswordValidationSchema,
    reTypePassword: resetPasswordValidationSchema
  })
  const audit = trackEvent(dataProvider)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordForm>({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = (): void => {
    setOpenChangePasswordModal(false)
  }

  const { notify } = useContext(NotificationContext)

  const onSubmit = async (data: ChangePasswordForm): Promise<void> => {
    const { newPassword, currentPassword } = data
    if (
      dataProvider !== undefined &&
      authProvider !== undefined &&
      authProvider.getIdentity
    ) {
      const user = await authProvider.getIdentity()

      try {
        if (user && user.updateBefore !== '') {
          const res = await changeAndUpdatePassword({
            password: newPassword,
            currentPassword,
            userId: user.id as number
          })
          if (res.status === 201) {
            setOpenChangePasswordModal(false)
            const res = await deleteUpdateBefore({
              userId: user.id as number
            })

            const updatedUser = {
              ...user,
              updateBefore: res.data.userDetails.updateBefore
            }
            const token = encryptData(`${JSON.stringify(updatedUser)}`)
            localStorage.setItem(constants.ACCESS_TOKEN_KEY, token)
            await audit({
              resource: constants.R_USERS,
              activityType: AuditType.CHANGE_PASSWORD,
              dataId: user.id as number,
              activityDetail: 'User Password Changed (forced change)',
              securityRelated: true,
              subjectResource: null,
              subjectId: null
            })
            notify(res.data.message)
          }
        } else if (user) {
          const res = await changeAndUpdatePassword({
            password: newPassword,
            currentPassword,
            userId: user.id as number
          })
          if (res.status === 201) {
            setOpenChangePasswordModal(false)
            await audit({
              resource: constants.R_USERS,
              activityType: AuditType.CHANGE_PASSWORD,
              dataId: user.id as number,
              activityDetail: 'User Password Changed',
              securityRelated: true,
              subjectResource: null,
              subjectId: null
            })
            notify(res.data.message)
          }
        }
      } catch (err) {
        if (isAxiosError(err)) {
          notify(getErrorDetails(err as AxiosError).message, { type: 'error' })
        } else {
          notify((err as Error).message, { type: 'error' })
        }
      }
    }
  }
  const style = {
    backgroundColor: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    p: 4
  }
  const buttonPrimaryStyle = {
    backgroundColor: '#1F3860',
    '&:hover': {
      backgroundColor: '#1F3860'
    }
  }
  return (
    <div>
      <Modal
        open={openChangePasswordModal}
        onClose={() => {
          setOpenChangePasswordModal(false)
        }}>
        <Box sx={style}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography>
              <p>
                <b>Change Your Password</b>
              </p>
              <p>The password should include these items:</p>
            </Typography>
            <Typography>
              <ul>
                <li>At least 10 characters in length</li>
                <li>Upper and lower case letters</li>
                <li>At least one digit</li>
                <li>At least one special character</li>
              </ul>
            </Typography>

            <TextField
              type={showCurrentPassword ? 'text' : 'password'}
              fullWidth
              margin='normal'
              placeholder='Current Password'
              {...register('currentPassword')}
              error={Boolean(errors.currentPassword)}
              helperText={errors.currentPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        setShowCurrentPassword(!showCurrentPassword)
                      }}
                      edge='end'>
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              type={showNewPassword ? 'text' : 'password'}
              fullWidth
              margin='normal'
              placeholder='New password'
              {...register('newPassword')}
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        setShowNewPassword(!showNewPassword)
                      }}
                      edge='end'>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              type={showRetypePassword ? 'text' : 'password'}
              fullWidth
              margin='normal'
              placeholder='Re-type password'
              {...register('reTypePassword')}
              error={Boolean(errors.reTypePassword)}
              helperText={errors.reTypePassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        setShowRetypePassword(!showRetypePassword)
                      }}
                      edge='end'>
                      {showRetypePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button type='submit' variant='contained' sx={buttonPrimaryStyle}>
              Submit
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  )
}

export default ChangePassword
