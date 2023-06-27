import { type ReactElement } from 'react'
import {
  ReferenceInput,
  type ReferenceInputProps,
  AutocompleteInput,
  type AutocompleteInputProps,
  ReferenceArrayInput,
  AutocompleteArrayInput
} from 'react-admin'
import { R_USERS } from '../constants'

interface Props<T> {
  optionField?: keyof T
  inputProps?: AutocompleteInputProps
  multiple?: boolean
}

export default function SourceInput<T extends Record<string, any>>(
  props: Props<T> & ReferenceInputProps
): ReactElement {
  const {
    optionField = 'name',
    inputProps = {},
    multiple = false,
    ...rest
  } = props

  const optionText = (item: T): string => {
    return rest.reference === R_USERS
      ? `${item[optionField]} (${item.staffNumber})`
      : (item[optionField] as string)
  }

  return multiple ? (
    <ReferenceArrayInput {...rest}>
      <AutocompleteArrayInput sx={{ width: '100%' }} optionText={optionText} />
    </ReferenceArrayInput>
  ) : (
    <ReferenceInput {...rest}>
      <AutocompleteInput
        sx={{ width: '100%' }}
        optionText={optionText}
        {...inputProps}
      />
    </ReferenceInput>
  )
}
