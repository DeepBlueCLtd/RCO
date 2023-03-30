import { ReferenceField, TextField, type TextFieldProps } from 'react-admin'

interface SourceFieldProps {
  source: string
  label?: string
  reference?: string
  sourceField?: string
  textProps?: TextFieldProps
}

const SourceField = (props: SourceFieldProps): React.ReactElement => {
  const {
    source,
    label,
    reference,
    sourceField = 'name',
    textProps = {}
  } = props
  return (
    <ReferenceField
      source={source}
      reference={reference !== undefined ? reference : source}
      label={label}>
      <TextField source={sourceField} {...textProps} />
    </ReferenceField>
  )
}

export default SourceField
