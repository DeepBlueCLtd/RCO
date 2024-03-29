import { Box, FormHelperText, type Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  DatePicker as MuiDatePicker,
  LocalizationProvider,
  type DatePickerProps
} from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import dayjs from 'dayjs'
import { useMemo, useState, useEffect } from 'react'
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

export default function DatePicker(props: Props): React.ReactElement {
  const { label, dataPickerProps, format, source } = props
  const [error, setError] = useState<string | null>('')
  const { field, fieldState } = useInput({ source })
  const styles = useStyles()

  const initialFieldValue = field.value

  useEffect(() => {
    if (initialFieldValue === '' && typeof format !== 'undefined') {
      field.onChange(Number(dayjs(new Date()).format(format)))
    }
  }, [field, format, initialFieldValue])

  const value: Date | null = useMemo(() => {
    if (field.value instanceof Date) return field.value
    if (typeof format === 'undefined') {
      return new Date(field.value)
    }
    return dayjs(String(field.value), format).toDate()
  }, [field.value])

  const errorMessage = error ?? fieldState.error?.message

  const handleOnchange = (
    value: Date | null,
    error: { validationError: null | string }
  ): void => {
    if (value === null) {
      field.onChange(null)
      return
    }
    if (typeof format !== 'undefined') {
      field.onChange(Number(dayjs(value).format(format)))
    } else {
      field.onChange(dayjs(value).toDate())
    }
    setError(error.validationError)
  }

  const onError = (error: any): void => {
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
