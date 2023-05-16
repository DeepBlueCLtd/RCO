import {
  ReferenceField,
  TextField,
  type TextFieldProps,
  type LinkToType,
  FunctionField
} from 'react-admin'
import { R_USERS } from '../constants'

interface SourceFieldProps {
  source: string
  label?: string | false
  reference?: string
  sourceField?: string
  textProps?: TextFieldProps
  link?: LinkToType
}

const SourceField = (props: SourceFieldProps): React.ReactElement => {
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
      source={source}
      reference={reference !== undefined ? reference : source}
      label={label}>
      {reference !== undefined && reference === R_USERS ? (
        <FunctionField
          label={label}
          {...textProps}
          render={(record: User) => `${record.name} (${record.staffNumber})`}
        />
      ) : (
        <TextField source={sourceField} {...textProps} />
      )}
    </ReferenceField>
  )
}

export default SourceField
