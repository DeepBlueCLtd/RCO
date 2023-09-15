import { Save } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import * as constants from '../../../constants'
import {
  SimpleForm,
  useCreatePath,
  useDataProvider,
  useRecordContext,
  useRedirect
} from 'react-admin'
import { useLocation, useParams } from 'react-router-dom'
import { isNumber } from '../../../utils/number'
import CoreForm from './CoreForm'
import ItemFormToolbar from './ItemFormToolbar'
import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import dayjs from 'dayjs'

const schema = yup.object({
  mediaType: yup.number().required(),
  startDate: yup.date().optional(),
  endDate: yup.date().when('startDate', {
    is: undefined,
    then: (schema) => schema.optional(),
    otherwise: (schema) =>
      schema
        .required()
        .test(
          'endDate',
          'End date must be greater than start date',
          function (value) {
            return dayjs(value).diff(this.parent.startDate) > 0
          }
        )
  }),
  batch: yup.number().required(),
  vaultLocation: yup.number().required(),
  protectiveMarking: yup.number().required(),
  editRemarks: yup.string()
})
export default function ItemForm({ isEdit }: FormProps): React.ReactElement {
  const [batch, setBatch] = useState<Batch>()
  const location = useLocation()
  const redirect = useRedirect()
  const createPath = useCreatePath()
  const { id } = useParams()
  const record = useRecordContext<Item>()
  const dataProvider = useDataProvider()
  const [itemId, setItemId] = useState<Item['id']>()
  const [openRemarks, setOpenRemarks] = useState(false)

  const onSave = (event: React.SyntheticEvent): void => {
    setOpenRemarks(true)
    event.preventDefault()
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const batch = searchParams.get('batch') ?? record.batch

    const isValidNumber = isNumber(batch)
    if (isValidNumber) {
      dataProvider
        .getOne<Batch>(constants.R_BATCHES, { id: Number(batch) })
        .then(({ data }) => {
          setBatch(data)
        })
        .catch(console.log)
    } else {
      if (typeof id === 'undefined') {
        redirect(createPath({ resource: constants.R_RICH_ITEMS, type: 'list' }))
      }
    }
  }, [])

  const defaultValues: Partial<Item> = {
    itemNumber: '',
    loanedTo: undefined
  }

  const pageTitle = isEdit !== undefined ? 'Edit Item' : 'Add new Item'
  return (
    <Box>
      {batch != null && (
        <TextField
          disabled
          sx={{ margin: '16px' }}
          defaultValue={batch?.batchNumber}
          InputProps={{
            sx: {
              padding: '13px',
              '& input': {
                padding: 0,
                lineHeight: 1
              }
            },
            endAdornment: (
              <InputAdornment position='end'>
                <Save />
              </InputAdornment>
            )
          }}
        />
      )}
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '0 15px' }}>
        <constants.ICON_ITEM /> {pageTitle}
      </Typography>
      <SimpleForm
        resource={constants.R_ITEMS}
        warnWhenUnsavedChanges
        resolver={yupResolver(schema)}
        defaultValues={defaultValues}
        toolbar={
          <ItemFormToolbar
            onSuccess={({ id }: { id: number }) => {
              setItemId(id)
            }}
            openRemarks={openRemarks}
            setOpenRemarks={setOpenRemarks}
            onSave={onSave}
          />
        }>
        <CoreForm
          isRemarksOpen={openRemarks}
          itemId={itemId}
          setItemId={setItemId}
          batch={batch?.id}
        />
      </SimpleForm>
    </Box>
  )
}
