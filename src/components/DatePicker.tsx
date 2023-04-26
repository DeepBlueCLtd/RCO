import { Box, FormHelperText, type Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  DatePicker as MuiDatePicker,
  LocalizationProvider,
  type DatePickerProps
} from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { type TextInputProps, useInput } from 'react-admin'

type Props = Omit<TextInputProps, 'format'> & {
  format?: string
  dataPickerProps?: DatePickerProps<Date>
}

const useStyles = makeStyles((theme: Theme) => {
  const mainTheme: string = theme.palette.error.main
  return {
    root: {
      '&.error': {
        '& label': {
          color: theme.palette.error.main
        },
        '& .MuiInputBase-root::before': {
          borderBottom: `1px solid ${mainTheme}`
        }
      }
    }
  }
})

export default function DatePicker(props: Props) {
  const { label, dataPickerProps, format, ...rest } = props
  const [error, setError] = useState<string | null>('')
  const { field, fieldState } = useInput(rest)
  const styles = useStyles()

  const value: Date | null = useMemo(() => {
    if (field.value instanceof Date) return field.value
    if (
      typeof field.value === 'string' &&
      field.value === '' &&
      typeof format !== 'undefined'
    ) {
      field.onChange(dayjs(new Date()).format(format))
      return new Date()
    }
    if (typeof format === 'undefined') {
      return new Date(field.value)
    }
    return dayjs(field.value, format).toDate()
  }, [field.value])

  const errorMessage = error ?? fieldState.error?.message

  const handleOnchange = (
    value: Date | null,
    error: { validationError: null | string }
  ) => {
    if (value === null) {
      setError('Year is a required field')
      return
    }
    if (typeof format !== 'undefined') {
      field.onChange(dayjs(value).format(format))
    } else {
      field.onChange(dayjs(value).toDate())
    }
    setError(error.validationError)
  }

  const onError = (error: any) => {
    setError(error)
  }

  const rootStyle: string = styles.root
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box display='flex' flexDirection='column' width='100%'>
        <MuiDatePicker
          className={`${rootStyle} ${
            typeof errorMessage === 'string' && errorMessage !== ''
              ? 'error'
              : ''
          }`}
          onError={onError}
          {...dataPickerProps}
          value={value}
          onChange={handleOnchange}
          label={label}
        />
        <FormHelperText error sx={{ margin: '4px 0 0px 14px' }}>
          {errorMessage}
        </FormHelperText>
      </Box>
    </LocalizationProvider>
  )
}
