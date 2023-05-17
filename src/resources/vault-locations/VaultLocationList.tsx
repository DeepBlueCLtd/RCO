import React from 'react'
import { Datagrid, FunctionField, List } from 'react-admin'
import FlexBox from '../../components/FlexBox'
import VaultLocationReport from '../../components/VaultLocationReport'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'

export default function VaultLocationList(): React.ReactElement {
  const { hasAccess } = useCanAccess()
  const hasWriteAccess = hasAccess(constants.R_VAULT_LOCATION, { write: true })

  const BulkActions = (): React.ReactElement => {
    return (
      <>
        <FlexBox>
          <VaultLocationReport />
        </FlexBox>
      </>
    )
  }

  return (
    <List>
      <Datagrid
        rowClick={hasWriteAccess ? 'edit' : undefined}
        bulkActionButtons={<BulkActions />}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
      </Datagrid>
    </List>
  )
}
