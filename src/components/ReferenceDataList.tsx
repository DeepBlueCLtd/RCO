import React from 'react'
import {
  CreateButton,
  Datagrid,
  FunctionField,
  type Identifier,
  List,
  TopToolbar,
  BooleanField,
  BulkDeleteButton
} from 'react-admin'
import * as constants from '../constants'
import FlexBox from './FlexBox'
import VaultLocationReport from './VaultLocationReport'

interface PropType {
  name: string
}

export default function ReferenceDataList({
  name
}: PropType): React.ReactElement {
  const cName: string = name
  const ListActions = () => (
    <TopToolbar>
      <CreateButton to={`/reference-data/${cName}/create`} />
    </TopToolbar>
  )
  const BulkActions = () => {
    return (
      <>
        <FlexBox>
          {cName === constants.R_VAULT_LOCATION && <VaultLocationReport />}
          <BulkDeleteButton mutationMode='pessimistic' />
        </FlexBox>
      </>
    )
  }
  return (
    <List actions={<ListActions />}>
      <Datagrid
        bulkActionButtons={<BulkActions />}
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `/reference-data/${cName}/${cID}`
        }}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
        {name === 'department' ? <BooleanField source='active' /> : ''}
      </Datagrid>
    </List>
  )
}
