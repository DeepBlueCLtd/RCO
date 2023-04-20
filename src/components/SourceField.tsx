import {
  ReferenceField,
  TextField,
  type TextFieldProps,
  type LinkToType
} from 'react-admin'

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
      <TextField source={sourceField} {...textProps} />
    </ReferenceField>
  )
}

export default SourceField
