import { Save } from '@mui/icons-material'
import React, { useEffect, useMemo, useState } from 'react'
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
import { DateTime } from 'luxon'

const schema = yup.object({
  mediaType: yup
    .number()
    .strict()
    .required('Media Type is required')
    .typeError('Media Type must be a number'),
  startDate: yup.date().optional().nullable(),
  endDate: yup
    .date()
    .optional()
    .nullable()
    .test(
      'endDate',
      'End date must be greater than or equal to start date',
      function (value) {
        const startDate = this.parent.startDate
        return startDate
          ? value
            ? dayjs(value).diff(startDate) >= 0
            : true
          : true
      }
    ),
  batch: yup
    .number()
    .strict()
    .required('Batch is required')
    .typeError('Batch must be a number'),
  vaultLocation: yup
    .number()
    .strict()
    .required('Vault Location is required')
    .typeError('Vault Location must be a number'),
  protectiveMarking: yup
    .number()
    .strict()
    .required('Protective Marking is required')
    .typeError('Protective Marking must be a number'),
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

  const { startDate, endDate } = useMemo((): {
    startDate: string
    endDate: string
  } => {
    const dateTime = DateTime.local().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    })
    return {
      startDate: dateTime.toString(),
      endDate: dateTime.plus({ days: 1 }).toString()
    }
  }, [])

  const defaultValues: Partial<Item> = {
    itemNumber: '',
    loanedTo: undefined,
    startDate,
    endDate
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
            isEdit
          />
        }>
        <CoreForm
          isEdit={isEdit}
          isRemarksOpen={openRemarks}
          itemId={itemId}
          setItemId={setItemId}
          batch={batch?.id}
        />
      </SimpleForm>
    </Box>
  )
}
