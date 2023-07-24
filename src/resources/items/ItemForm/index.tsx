import { Save } from '@mui/icons-material'
import { useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import * as constants from '../../../constants'
import {
  SimpleForm,
  useCreatePath,
  useDataProvider,
  useRecordContext,
  useRedirect,
  useRefresh
} from 'react-admin'
import { useLocation, useParams } from 'react-router-dom'
import { isNumber } from '../../../utils/number'
import CoreForm from './CoreForm'
import dayjs from 'dayjs'
import ItemFormToolbar from './ItemFormToolbar'
import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import { DateTime } from 'luxon'

const schema = yup.object({
  mediaType: yup.number().required(),
  startDate: yup.date().required(),
  endDate: yup
    .date()
    .required()
    .test(
      'endDate',
      'End date must be greater than start date',
      function (value) {
        return dayjs(value).diff(this.parent.startDate) > 0
      }
    ),
  batchId: yup.number().required(),
  vaultLocation: yup.number().required(),
  protectiveMarking: yup.number().required()
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
  const refresh = useRefresh()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const batch = searchParams.get('batch') ?? record.batchId

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
        redirect(createPath({ resource: constants.R_ITEMS, type: 'list' }))
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
      second: 0
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
        warnWhenUnsavedChanges
        resolver={yupResolver(schema)}
        defaultValues={defaultValues}
        toolbar={
          <ItemFormToolbar
            onSuccess={({ id }: { id: number }) => {
              setItemId(id)
              refresh()
            }}
          />
        }>
        <CoreForm itemId={itemId} setItemId={setItemId} batchId={batch?.id} />
      </SimpleForm>
    </Box>
  )
}
