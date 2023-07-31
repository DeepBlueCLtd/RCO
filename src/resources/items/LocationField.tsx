import { useEffect, useState } from 'react'
import { FunctionField, type Identifier } from 'react-admin'

interface Props {
  users?: Record<Identifier, User>
  vaultLocations?: Record<Identifier, VaultLocation>
  label: string
}

export default function LocationField(props: Props): React.ReactElement {
  const { label } = props
  const [users, setUsers] = useState<Record<Identifier, User>>()
  const [vaultLocations, setVaultLocations] =
    useState<Record<Identifier, VaultLocation>>()

  useEffect(() => {
    setUsers(props?.users)
    setVaultLocations(props?.vaultLocations)
  }, [props])

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
