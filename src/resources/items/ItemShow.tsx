import React from 'react'
import { Card, CardContent } from '@mui/material'
import { DateField, Show } from 'react-admin'
import FieldWithLabel from '../../components/FieldWithLabel'

export default function ItemShow(): React.ReactElement {
  return (
    <Show>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <FieldWithLabel label='Id' source='id' />
          <FieldWithLabel label='Reference' source='item_number' />
          <FieldWithLabel
            label='Vault location'
            source='vault_location'
            reference='vaultLocation'
          />
          <FieldWithLabel
            label='Protective marking'
            source='protective_marking'
            reference='protectiveMarking'
          />
          <FieldWithLabel label='Start' source='start' component={DateField} />
          <FieldWithLabel label='End' source='end' component={DateField} />
          <FieldWithLabel label='Remarks' source='remarks' />
        </CardContent>
      </Card>
    </Show>
  )
}
