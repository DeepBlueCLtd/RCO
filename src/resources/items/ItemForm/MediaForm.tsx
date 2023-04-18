import React, { useMemo, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { NumberInput, TextInput } from 'react-admin'

interface FormProps {
  source: string
  disabled?: boolean
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
    formContext?.setValue(`${rest.source}.mediaType`, type)
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
  const { source, disabled } = props
  return (
    <>
      <NumberInput
        disabled={disabled}
        min={1}
        label='Size'
        sx={sx}
        source={`${source}.size`}
      />
    </>
  )
}

function TapeForm(props: FormProps): React.ReactElement {
  const { source, disabled } = props
  return (
    <>
      <NumberInput
        disabled={disabled}
        label='Minutes'
        min={1}
        sx={sx}
        source={`${source}.minutes`}
      />
      <TextInput
        disabled={disabled}
        label='Brand'
        sx={sx}
        source={`${source}.brand`}
      />
    </>
  )
}

function PaperForm(props: FormProps): React.ReactElement {
  const { source, disabled } = props
  return (
    <>
      <TextInput
        disabled={disabled}
        label='Pending'
        sx={sx}
        source={`${source}.pending`}
      />
    </>
  )
}
