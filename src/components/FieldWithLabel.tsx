import { Typography } from '@mui/material'
import React, { type FC, useMemo } from 'react'
import { TextField } from 'react-admin'
import SourceField from './SourceField'

interface Props {
  label: string
  reference?: string
  source: string
  component?: FC<any>
  [key: string]: any
}

const FieldWithLabel = (props: Props): React.ReactElement => {
  const { label, source, reference, component, ...rest } = props

  const render = useMemo(() => {
    if (typeof component !== 'undefined') {
      return React.createElement(component, { source, ...rest })
    }
    if (typeof reference === 'string' && reference !== '') {
      return <SourceField source={source} reference={reference} />
    }
    return <TextField source={source} />
  }, [])

  return (
    <Typography fontWeight='bold'>
      {label}: {render}
    </Typography>
  )
}

export default FieldWithLabel
