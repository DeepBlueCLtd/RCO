import { type ReactElement } from 'react'
import {
  ReferenceInput,
  type ReferenceInputProps,
  SelectInput
} from 'react-admin'

interface Props<T> {
  optionField?: keyof T
}

export default function SourceInput<T extends Record<string, any>>(
  props: Props<T> & ReferenceInputProps
): ReactElement {
  const { optionField = 'name', ...rest } = props

  const optionText = (item: T) => item[optionField] as string

  return (
    <ReferenceInput {...rest}>
      <SelectInput optionText={optionText} />
    </ReferenceInput>
  )
}
