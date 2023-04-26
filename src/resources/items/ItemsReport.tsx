import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import {
  Datagrid,
  List,
  TextField,
  useDataProvider,
  useGetIdentity,
  useListContext,
  type ListProps
} from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import { DateTime } from 'luxon'
import { Download } from '@mui/icons-material'
import Printable from '../../components/Printable'
import FlexBox from '../../components/FlexBox'

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

interface FieldWithReferenceProps {
  field: RefFieldType
  value: string | number
}

interface FieldValueProps {
  field: FieldType
  value: string | number
}

const FieldValue = (props: FieldValueProps): React.ReactElement => {
  const {
    field: { label, type },
    value
  } = props

  return (
    <FlexBox columnGap={'5px'}>
      <Typography fontWeight={700}>{label}:</Typography>
      <Typography>
        {type === 'date'
          ? DateTime.fromISO(value as string).toFormat('dd/MM/yyyy, hh:mm:ss')
          : value}
      </Typography>
    </FlexBox>
  )
}

const FieldWithReference = (
  props: FieldWithReferenceProps
): React.ReactElement => {
  const {
    field: { source, label, resource, name }
  } = props

  const dataProvider = useDataProvider()
  const [value, setValue] = useState('')

  const id: string | number = props.value
  useEffect(() => {
    dataProvider
      .getOne(resource, { id })
      .then(({ data }) => {
        setValue(data[source])
      })
      .catch(console.log)
  }, [id])

  return <FieldValue field={{ type: 'text', label, name }} value={value} />
}

export default function ItemsReport(props: Props): React.ReactElement {
  return (
    <List
      resource={constants.R_ITEMS}
      pagination={false}
      actions={false}
      sx={{ margin: '20px 0' }}
      perPage={1000}
      disableSyncWithLocation
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

export function ItemAssetReport(props: Props) {
  const { filterValues } = useListContext()
  const [open, setOpen] = useState(false)

  const filters: Record<keyof Item, any> = filterValues

  const { data } = useGetIdentity()

  const handleOpen = (open: boolean) => () => {
    setOpen(open)
  }

  const appliedFilters: React.ReactElement[] = useMemo(() => {
    return Object.entries(filters).map(
      (entry: [string, any]): React.ReactElement => {
        const [key, value] = entry

        const referenceField = referenceFields.find(
          (field: RefFieldType) => field.name === key
        )
        if (referenceField !== undefined)
          return (
            <FieldWithReference
              key={key}
              field={referenceField}
              value={value}
            />
          )

        const fieldValue = fields.find((field: FieldType) => field.name === key)

        if (fieldValue !== undefined)
          return <FieldValue key={key} field={fieldValue} value={value} />

        return <Fragment key={key}></Fragment>
      }
    )
  }, [filters])

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
              <FieldValue
                field={{ label: 'User', type: 'text', name: '' }}
                value={data?.fullName ?? ''}
              />
              {Object.keys(filters).length !== 0 && (
                <>
                  <Typography sx={{ display: 'block', fontWeight: 700 }}>
                    Filters
                  </Typography>
                  <Box marginLeft={2.5}>{appliedFilters}</Box>
                </>
              )}
              <FieldValue
                field={{ label: 'Time', name: '', type: 'date' }}
                value={new Date().toISOString()}
              />
            </CardContent>
          </Card>
          <ItemsReport filter={filters} {...props}>
            <TextField source='item_number' label='Item Number' />
            <TextField source='mediaType' label='Media type' />
            <TextField source='remarks' label='Remark' />
          </ItemsReport>
        </Box>
      </Printable>
    </>
  )
}
