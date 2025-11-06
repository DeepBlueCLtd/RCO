import { describe, it, expect } from '@jest/globals'
import * as yup from 'yup'
import {
  common,
  passwordValidationSchema,
  resetPasswordValidationSchema
} from './password-validation.schema'

describe('Password Validation Schema', () => {
  describe('common password rules', () => {
    it('should reject passwords shorter than 10 characters', async () => {
      await expect(common.validate('Short1!')).rejects.toThrow(
        'Password must be at least 10 characters long'
      )
    })

    it('should reject passwords without uppercase letters', async () => {
      await expect(common.validate('lowercase123!')).rejects.toThrow(
        'Password must contain at least one uppercase letter'
      )
    })

    it('should reject passwords without lowercase letters', async () => {
      await expect(common.validate('UPPERCASE123!')).rejects.toThrow(
        'Password must contain at least one lowercase letter'
      )
    })

    it('should reject passwords without numeric digits', async () => {
      await expect(common.validate('NoNumbersHere!')).rejects.toThrow(
        'Password must contain at least one numeric digit'
      )
    })

    it('should reject passwords without special characters', async () => {
      await expect(common.validate('NoSpecial123')).rejects.toThrow(
        'Special character required'
      )
    })

    it('should reject passwords with common patterns', async () => {
      // Use longer passwords that meet length requirement
      await expect(common.validate('MyPassword123!')).rejects.toThrow(
        'Password cannot match common patterns'
      )

      await expect(common.validate('AdminAccount1!')).rejects.toThrow(
        'Password cannot match common patterns'
      )

      await expect(common.validate('Qwerty123456!')).rejects.toThrow(
        'Password cannot match common patterns'
      )
    })

    it('should reject passwords with 4 consecutive ascending characters', async () => {
      await expect(common.validate('Abcd1234!Test')).rejects.toThrow(
        'Password cannot include 4 consecutive characters'
      )

      await expect(common.validate('Test!5678More')).rejects.toThrow(
        'Password cannot include 4 consecutive characters'
      )
    })

    it('should reject passwords with 4 consecutive descending characters', async () => {
      await expect(common.validate('Zyxw9876!Test')).rejects.toThrow(
        'Password cannot include 4 consecutive characters'
      )

      await expect(common.validate('Test!8765More')).rejects.toThrow(
        'Password cannot include 4 consecutive characters'
      )
    })

    it('should accept valid passwords meeting all criteria', async () => {
      const validPassword = 'MyS3cure!P@ss'
      await expect(common.validate(validPassword)).resolves.toBe(validPassword)
    })

    it('should accept passwords with non-consecutive repeated characters', async () => {
      const validPassword = 'Aa!1Bb@2Cc#3Dd'
      await expect(common.validate(validPassword)).resolves.toBe(validPassword)
    })
  })

  describe('passwordValidationSchema (user form)', () => {
    it('should reject passwords containing the user name', async () => {
      const userFormSchema = yup.object({
        name: yup.string().required(),
        username: yup.string().required(),
        hashed_password: passwordValidationSchema
      })

      await expect(
        userFormSchema.validate({
          name: 'JohnDoe',
          username: 'jdoe',
          hashed_password: 'JohnDoe123!'
        })
      ).rejects.toThrow('Password cannot include name or staff number')
    })

    it('should reject passwords containing the staff ID', async () => {
      const userFormSchema = yup.object({
        name: yup.string().required(),
        username: yup.string().required(),
        hashed_password: passwordValidationSchema
      })

      await expect(
        userFormSchema.validate({
          name: 'John Doe',
          username: 'staff123',
          hashed_password: 'Staff123!Pwd'
        })
      ).rejects.toThrow('Password cannot include name or staff number')
    })

    it('should accept valid passwords not containing name or staff ID', async () => {
      const userFormSchema = yup.object({
        name: yup.string().required(),
        username: yup.string().required(),
        hashed_password: passwordValidationSchema
      })

      const validData = {
        name: 'John Doe',
        username: 'jdoe',
        hashed_password: 'MyS3cure!P@ss'
      }

      await expect(userFormSchema.validate(validData)).resolves.toMatchObject(validData)
    })

    it('should be case insensitive when checking for name/staff ID', async () => {
      const userFormSchema = yup.object({
        name: yup.string().required(),
        username: yup.string().required(),
        hashed_password: passwordValidationSchema
      })

      await expect(
        userFormSchema.validate({
          name: 'Alice',
          username: 'asmith',
          hashed_password: 'ALICE123!test'
        })
      ).rejects.toThrow('Password cannot include name or staff number')

      await expect(
        userFormSchema.validate({
          name: 'Alice',
          username: 'asmith',
          hashed_password: 'ASMITH456!test'
        })
      ).rejects.toThrow('Password cannot include name or staff number')
    })
  })

  describe('resetPasswordValidationSchema', () => {
    it('should reject when passwords do not match', async () => {
      const resetFormSchema = yup.object({
        newPassword: yup.string().required(),
        confirmPassword: resetPasswordValidationSchema
      })

      await expect(
        resetFormSchema.validate({
          newPassword: 'MyS3cure!P@ss',
          confirmPassword: 'DifferentP@ss123'
        })
      ).rejects.toThrow('Passwords do not match')
    })

    it('should accept when passwords match', async () => {
      const resetFormSchema = yup.object({
        newPassword: yup.string().required(),
        confirmPassword: resetPasswordValidationSchema
      })

      const validData = {
        newPassword: 'MyS3cure!P@ss',
        confirmPassword: 'MyS3cure!P@ss'
      }

      await expect(resetFormSchema.validate(validData)).resolves.toMatchObject(validData)
    })

    it('should still enforce all common password rules', async () => {
      const resetFormSchema = yup.object({
        newPassword: yup.string().required(),
        confirmPassword: resetPasswordValidationSchema
      })

      await expect(
        resetFormSchema.validate({
          newPassword: 'short',
          confirmPassword: 'short'
        })
      ).rejects.toThrow('Password must be at least 10 characters long')
    })
  })
})
