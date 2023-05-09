import { Album, GroupWork, MenuBook, Save } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import * as constants from '../../../constants'
import {
  TabbedForm,
  useCreatePath,
  useDataProvider,
  useRecordContext,
  useRedirect
} from 'react-admin'
import { useLocation, useParams } from 'react-router-dom'
import { isNumber } from '../../../utils/number'
import CoreForm from './CoreForm'
import { mediaTypeOptions } from '../../../utils/media'
import dayjs from 'dayjs'
import MediaForm from './MediaForm'
import ItemFormToolbar from './ItemFormToolbar'
import { Box, InputAdornment, TextField } from '@mui/material'

const schema = yup.object({
  mediaType: yup
    .string()
    .required()
    .oneOf(mediaTypeOptions.map(({ id }) => id)),
  start: yup.date().required(),
  end: yup
    .date()
    .required()
    .test(
      'endDate',
      'End date must be greater than start date',
      function (value) {
        return dayjs(value).diff(this.parent.start) > 0
      }
    ),
  batchId: yup.number().required(),
  vaultLocation: yup.number().required(),
  protectiveMarking: yup.number().required(),
  magTape: yup.object({
    brand: yup.string(),
    minutes: yup.number().typeError('Invalid value')
  }),
  dvd: yup.object({
    size: yup.number().typeError('Invalid value')
  })
})

export default function ItemForm(): React.ReactElement {
  const [batch, setBatch] = useState<Batch>()
  const location = useLocation()
  const redirect = useRedirect()
  const createPath = useCreatePath()
  const { id } = useParams()
  const record = useRecordContext<Item>()
  const dataProvider = useDataProvider()

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

  const defaultValues: Partial<Item> = {
    item_number: '',
    loanedTo: undefined,
    dvd: {
      mediaType: 'DVD',
      size: 0
    },
    magTape: {
      mediaType: 'Tape',
      minutes: 0,
      brand: ''
    }
  }
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
      <TabbedForm
        warnWhenUnsavedChanges
        resolver={yupResolver(schema)}
        defaultValues={defaultValues}
        toolbar={<ItemFormToolbar />}>
        <TabbedForm.Tab label='Core'>
          <CoreForm batchId={batch?.id} />
        </TabbedForm.Tab>
        <TabbedForm.Tab
          label='Mag tape'
          icon={<GroupWork />}
          iconPosition='end'>
          <MediaForm type='Tape' source='magTape' />
        </TabbedForm.Tab>
        <TabbedForm.Tab label='DVD' icon={<Album />} iconPosition='end'>
          <MediaForm type='DVD' source='dvd' />
        </TabbedForm.Tab>
        <TabbedForm.Tab label='Paper' icon={<MenuBook />} iconPosition='end'>
          <MediaForm type='Paper' source='paper' />
        </TabbedForm.Tab>
      </TabbedForm>
    </Box>
  )
}
