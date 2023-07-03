import { FunctionField } from 'react-admin'
import { R_CAT_CODE, R_CAT_HANDLING, R_PROTECTIVE_MARKING } from '../constants'

interface Props {
  source: string
}

export default function ProtectionField(props: Props): React.ReactElement {
  const { source, ...rest } = props
  const index =
    source === R_CAT_CODE
      ? 0
      : source === R_PROTECTIVE_MARKING
      ? 1
      : source === R_CAT_HANDLING
      ? 2
      : 3

  return (
    <FunctionField
      {...rest}
      render={(record: Batch | Item) => {
        const { protectionString = '' } = record
        const names = protectionString?.split('-')[index]
        return names || ''
      }}
    />
  )
}
