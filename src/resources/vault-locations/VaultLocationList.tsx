import React from 'react'
import { Datagrid, FunctionField, List } from 'react-admin'
import FlexBox from '../../components/FlexBox'
import VaultLocationReport from '../../components/VaultLocationReport'

export default function VaultLocationList(): React.ReactElement {
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
      <Datagrid rowClick='edit' bulkActionButtons={<BulkActions />}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
      </Datagrid>
    </List>
  )
}
