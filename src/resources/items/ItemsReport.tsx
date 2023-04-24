import { Typography } from '@mui/material'
import React from 'react'
import { Datagrid, List, TextField, type ListProps } from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'

export default function ItemsReport(
  props: Omit<ListProps, 'children'>
): React.ReactElement {
  return (
    <List
      resource={constants.R_ITEMS}
      pagination={false}
      actions={false}
      sx={{ margin: '20px 0' }}
      {...props}>
      <Typography variant='h6' margin='16px'>
        Items:
      </Typography>

      <Datagrid bulkActionButtons={false}>
        <TextField source='item_number' label='Item Number' />
        <TextField source='mediaType' label='Media type' />
        <SourceField source='vaultLocation' reference='vaultLocation' />
      </Datagrid>
    </List>
  )
}
