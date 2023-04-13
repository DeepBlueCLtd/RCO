import { type SxProps, Typography } from '@mui/material'
import React, { type FC, useMemo } from 'react'
import { TextField } from 'react-admin'
import SourceField from './SourceField'

export interface FieldWithLabelProps {
  label: string
  reference?: string
  source: string
  component?: FC<any>
  separator?: string
  labelPosition?: 'left' | 'top'
  labelStyles?: SxProps
  [key: string]: any
}

const FieldWithLabel = (props: FieldWithLabelProps): React.ReactElement => {
  const {
    label,
    source,
    reference,
    component,
    separator = ':',
    labelPosition = 'left',
    labelStyles,
    ...rest
  } = props

  const render = useMemo(() => {
    if (typeof component !== 'undefined') {
      return React.createElement(component, { source, ...rest })
    }
    if (typeof reference === 'string' && reference !== '') {
      return <SourceField source={source} reference={reference} />
    }
    return <TextField source={source} />
  }, [])

  const labelWithSeparator: string = `${label}${separator}`

  return (
    <Typography fontWeight='bold'>
      {labelPosition === 'top' ? (
        <Typography fontWeight='bold' sx={labelStyles}>
          {labelWithSeparator}
        </Typography>
      ) : (
        labelWithSeparator
      )}{' '}
      {render}
    </Typography>
  )
}

export default FieldWithLabel
