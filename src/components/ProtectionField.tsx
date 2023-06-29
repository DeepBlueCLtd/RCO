import { FunctionField } from 'react-admin'
import { R_CAT_CAVE, R_CAT_CODE } from '../constants'

interface Props {
  source: string
}

export default function ProtectionField(props: Props): React.ReactElement {
  const { source, ...rest } = props
  const index = source === R_CAT_CAVE ? 0 : source === R_CAT_CODE ? 1 : 2

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
