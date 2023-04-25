import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import React, { useState } from 'react'
import {
  Datagrid,
  List,
  Show,
  SimpleShowLayout,
  TextField,
  useListContext,
  type ListProps
} from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import { DateTime } from 'luxon'
import { Download } from '@mui/icons-material'
import Printable from '../../components/Printable'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type Props = PartialBy<ListProps, 'children'>

interface Field {
  name: string
  label: string
}

type FieldType = Field & {
  type: 'text' | 'date'
}

type RefFieldType = Field & {
  source: string
  resource: string
}

export default function ItemsReport(props: Props): React.ReactElement {
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
        {props.children !== undefined ? (
          props.children
        ) : (
          <>
            <TextField source='item_number' label='Item Number' />
            <TextField source='mediaType' label='Media type' />
            <SourceField source='vaultLocation' reference='vaultLocation' />
          </>
        )}
      </Datagrid>
    </List>
  )
}

const referenceFields: RefFieldType[] = [
  {
    name: 'vaultLocation',
    resource: constants.R_VAULT_LOCATION,
    source: 'name',
    label: 'Vault Location'
  },
  {
    name: 'createdBy_eq',
    resource: constants.R_USERS,
    source: 'name',
    label: 'Created By'
  },
  {
    name: 'createdBy',
    resource: constants.R_USERS,
    source: 'name',
    label: 'Created By'
  },
  {
    name: 'protectiveMarking',
    resource: 'protectiveMarking',
    source: 'name',
    label: 'Protective Marking'
  },
  {
    name: 'batchId',
    resource: constants.R_BATCHES,
    source: 'batchNumber',
    label: 'Batch'
  }
]

const fields: FieldType[] = [
  {
    name: 'mediaType',
    label: 'Media Type',
    type: 'text'
  },
  {
    name: 'start',
    label: 'Start',
    type: 'date'
  },
  {
    name: 'end',
    label: 'End',
    type: 'date'
  },
  {
    name: 'remarks',
    label: 'Remarks',
    type: 'text'
  },
  {
    name: 'item_number',
    label: 'Reference',
    type: 'text'
  }
]

export function ItemAssetReport() {
  const { filterValues } = useListContext()
  const [open, setOpen] = useState(false)

  const filters: Record<keyof Item, any> = filterValues

  const time = DateTime.now().toFormat('yyyy-LL-dd hh:mm')

  const handleOpen = (open: boolean) => () => { setOpen(open) }

  const getFieldValue = (
    field: FieldType,
    value: string | number
  ): React.ReactElement => {
    const { label, type } = field

    return (
      <>
        <Typography margin='10px' sx={{ display: 'inline-flex' }}>
          {label}:
        </Typography>
        <Typography sx={{ display: 'inline-flex' }}>
          {type === 'date'
            ? DateTime.fromISO(value as string).toFormat('dd/MM/yyyy, hh:mm:ss')
            : value}
        </Typography>
      </>
    )
  }

  const getFieldWithReference = (
    field: RefFieldType,
    value: string | number
  ): React.ReactElement => {
    const { source, label, resource } = field
    return (
      <>
        <Typography margin='10px' sx={{ display: 'inline-flex' }}>
          {label}:
        </Typography>
        <Show
          actions={false}
          resource={resource}
          id={value}
          sx={{
            width: 'fit-content',
            display: 'inline-flex',
            '& .RaShow-card': {
              boxShadow: 'none'
            }
          }}>
          <SimpleShowLayout>
            <TextField
              label={false}
              source={source}
              sx={{ fontSize: '1rem', fontWeight: 400 }}
            />
          </SimpleShowLayout>
        </Show>
      </>
    )
  }

  const appliedFilters: React.ReactElement[] = Object.entries(filters).map(
    (entry: [string, any]) => {
      const [key, value] = entry

      const referenceField = referenceFields.find(
        (field: RefFieldType) => field.name === key
      )

      if (referenceField != null) return getFieldWithReference(referenceField, value)

      const fieldValue = fields.find((field: FieldType) => field.name === key)
      if (fieldValue != null) return getFieldValue(fieldValue, value)

      return <></>
    }
  )

  return (
    <>
      <Button
        startIcon={<Download />}
        sx={{ lineHeight: '1.5' }}
        size='small'
        onClick={handleOpen(true)}>
        Asset Report
      </Button>
      <Printable open={open} onClose={handleOpen(false)}>
        <Box padding={'20px'}>
          <Typography variant='h4' textAlign='center' margin='10px'>
            RCO Asset Report
          </Typography>
          <Card>
            <CardContent>
              {Object.keys(filters).length !== 0 && (
                <Box>
                  <Typography sx={{ display: 'inline-flex' }}>
                    Filters:{' '}
                  </Typography>
                  {appliedFilters}
                </Box>
              )}
              <Typography>Time: {time}</Typography>
              {/* <Typography>User: </Typography> */}
            </CardContent>
          </Card>
          <ItemsReport>
            <TextField source='item_number' label='Item Number' />
            <TextField source='mediaType' label='Media type' />
            <TextField source='remarks' label='Remark' />
          </ItemsReport>
        </Box>
      </Printable>
    </>
  )
}
