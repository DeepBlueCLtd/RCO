import { type SxProps, Typography, Box, type Theme } from '@mui/material'
import React, { type FC, useMemo } from 'react'
import { type LinkToType, TextField, type TextFieldProps } from 'react-admin'
import SourceField from './SourceField'

export interface FieldWithLabelProps<T> {
  label: string
  reference?: string
  source: keyof T
  component?: FC<any>
  separator?: string
  labelPosition?: 'left' | 'top'
  labelStyles?: SxProps<Theme>
  sourceField?: string
  textProps?: TextFieldProps
  link?: LinkToType
  [key: string]: any
}

const FieldWithLabel = <T extends Dispatch>(
  props: FieldWithLabelProps<T>
): React.ReactElement => {
  const {
    label,
    source,
    reference,
    component,
    separator = ':',
    labelPosition = 'left',
    labelStyles,
    sourceField = 'name',
    textProps = {},
    link = false,
    ...rest
  } = props

  const render = useMemo(() => {
    if (typeof component !== 'undefined') {
      return React.createElement(component, { source, ...rest })
    }
    if (typeof reference === 'string' && reference !== '') {
      return (
        <SourceField<T>
          source={source}
          reference={reference}
          sourceField={sourceField}
          textProps={textProps}
          link={link}
        />
      )
    }
    return <TextField source={source as string} {...textProps} />
  }, [])

  const labelWithSeparator: string = `${label}${separator}`

  return (
    <Box fontWeight='bold'>
      {labelPosition === 'top' ? (
        <>
          <Typography fontWeight='bold' sx={labelStyles}>
            {labelWithSeparator}
          </Typography>
          {render}
        </>
      ) : (
        <Typography fontWeight='bold' sx={labelStyles}>
          {labelWithSeparator} {render}
        </Typography>
      )}{' '}
    </Box>
  )
}

export default FieldWithLabel
