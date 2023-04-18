import { Album, GroupWork, MenuBook } from '@mui/icons-material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { TabbedForm } from 'react-admin'
import CoreForm from './CoreForm'
import { mediaTypeOptions } from '../../../utils/media'
import dayjs from 'dayjs'
import MediaForm from './MediaForm'
import ItemFormToolbar from './ItemFormToolbar'
import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'

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
  remarks: yup.string().required(),
  magTape: yup.object({
    brand: yup.string(),
    minutes: yup.number().typeError('Invalid value')
  }),
  dvd: yup.object({
    size: yup.number().typeError('Invalid value')
  })
})

export default function ItemForm() {
  const location = useLocation()

  const searchParams: URLSearchParams = new URLSearchParams(location.search)
  const batch: string | null = searchParams.get('batch')
  const batchId: number | undefined =
    batch !== null ? Number(searchParams.get('batch')) : undefined

  const defaultValues: Partial<Item> = {
    item_number: '',
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
      <TabbedForm
        warnWhenUnsavedChanges
        resolver={yupResolver(schema)}
        defaultValues={defaultValues}
        toolbar={<ItemFormToolbar />}>
        <TabbedForm.Tab label='Core'>
          <CoreForm batchId={batchId} />
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
