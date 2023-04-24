import { type ReactElement } from 'react'
import {
  ReferenceInput,
  type ReferenceInputProps,
  SelectInput,
  type SelectInputProps
} from 'react-admin'

interface Props<T> {
  optionField?: keyof T
  inputProps?: SelectInputProps
}

export default function SourceInput<T extends Record<string, any>>(
  props: Props<T> & ReferenceInputProps
): ReactElement {
  const { optionField = 'name', inputProps = {}, ...rest } = props

  const optionText = (item: T) => item[optionField] as string

  return (
    <ReferenceInput {...rest}>
      <SelectInput
        sx={{ width: '100%' }}
        optionText={optionText}
        {...inputProps}
      />
    </ReferenceInput>
  )
}
