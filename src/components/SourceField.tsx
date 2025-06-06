import {
  ReferenceField,
  TextField,
  type TextFieldProps,
  type LinkToType,
  FunctionField
} from 'react-admin'
import { R_USERS } from '../constants'

interface SourceFieldProps<T> {
  source: keyof T
  label?: string | false
  reference: string | null
  sourceField?: string
  textProps?: TextFieldProps
  link?: LinkToType
}

const SourceField = <
  T extends
    | Audit
    | Dispatch
    | Item
    | _Users
    | Batch
    | VaultLocation
    | Destruction
    | Project
    | ProtectiveMarking
    | MediaType
    | LoanUser
>(
  props: SourceFieldProps<T>
): React.ReactElement => {
  const {
    source,
    label,
    reference,
    sourceField = 'name',
    link,
    textProps = {}
  } = props
  return (
    <ReferenceField
      link={link}
      source={source as string}
      reference={reference !== null ? reference : (source as string)}
      label={label}>
      {reference !== undefined && reference === R_USERS ? (
        <FunctionField
          label={label}
          {...textProps}
          render={(record: _Users) => `${record.name}`}
        />
      ) : (
        <TextField source={sourceField} {...textProps} />
      )}
    </ReferenceField>
  )
}

export default SourceField
