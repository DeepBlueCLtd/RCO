import { FunctionField, type Identifier } from 'react-admin'

interface Props {
  users?: Record<Identifier, User>
  vaultLocations?: Record<Identifier, VaultLocation>
  label: string
}

export default function LocationField(props: Props): React.ReactElement {
  const { users, vaultLocations, label } = props
  return (
    <FunctionField
      label={label}
      render={(record: Item) => {
        if (record?.loanedTo) {
          return users?.[record.loanedTo]?.name
        }
        if (record?.destructionDate) {
          return 'DESTROYED'
        }
        if (record?.dispatchedDate) {
          return 'SENT'
        }
        return vaultLocations?.[record?.vaultLocation]?.name
      }}
    />
  )
}
