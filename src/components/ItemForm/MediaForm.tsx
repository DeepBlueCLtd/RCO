import React, { useMemo, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { NumberInput, TextInput } from 'react-admin'

interface FormProps {
  source: string
}

interface Props {
  type: MediaType
}

const sx = { width: '100%' }

export default function MediaForm(
  props: Props & FormProps
): React.ReactElement {
  const { type, ...rest } = props
  const formContext = useFormContext()

  useEffect(() => {
    formContext?.setValue(`${rest.source}.media_type`, type)
  }, [type])

  const Component = useMemo(() => {
    switch (type) {
      case 'DVD':
        return DVDForm
      case 'Tape':
        return TapeForm
      case 'Paper':
        return PaperForm
      default:
        return React.Fragment
    }
  }, [type])

  return <Component {...rest} />
}

function DVDForm(props: FormProps): React.ReactElement {
  const { source } = props
  return (
    <>
      <NumberInput min={1} label='Size' sx={sx} source={`${source}.size`} />
    </>
  )
}

function TapeForm(props: FormProps): React.ReactElement {
  const { source } = props
  return (
    <>
      <NumberInput
        label='Minutes'
        min={1}
        sx={sx}
        source={`${source}.minutes`}
      />
      <TextInput label='Brand' sx={sx} source={`${source}.brand`} />
    </>
  )
}

function PaperForm(props: FormProps): React.ReactElement {
  const { source } = props
  return (
    <>
      <TextInput label='Pending' sx={sx} source={`${source}.pending`} />
    </>
  )
}
