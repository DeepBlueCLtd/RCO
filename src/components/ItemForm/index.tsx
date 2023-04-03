import { Album, GroupWork, MenuBook } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { TabbedForm, useCreatePath, useRedirect } from 'react-admin'
import { useLocation, useParams } from 'react-router-dom'
import { isNumber } from '../../utils/number'
import CoreForm from './CoreForm'
import { mediaTypeOptions } from '../../utils/media'
import dayjs from 'dayjs'
import MediaForm from './MediaForm'

const schema = yup.object({
  media_type: yup
    .string()
    .required()
    .oneOf(mediaTypeOptions.map(({ id }) => id)),
  start: yup.date().required(),
  end: yup
    .date()
    .required()
    .test(
      'end_date',
      'End date must be greater than start date',
      function (value) {
        return dayjs(value).diff(this.parent.start) > 0
      }
    ),
  batch_id: yup.number().required(),
  vault_location: yup.number().required(),
  protective_marking: yup.number().required(),
  remarks: yup.string().required(),
  mag_tape: yup.object({
    brand: yup.string().required(),
    minutes: yup.number().required()
  }),
  dvd: yup.object({
    size: yup.number().required()
  })
})

export default function ItemForm() {
  const [batchId, setBatchId] = useState<number>()
  const location = useLocation()
  const redirect = useRedirect()
  const createPath = useCreatePath()
  const { id } = useParams()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const batch = searchParams.get('batch') ?? ''

    const isValidNumber = isNumber(batch)

    setBatchId(isValidNumber ? Number(batch) : undefined)

    if (!isValidNumber && typeof id === 'undefined') {
      redirect(createPath({ resource: 'items', type: 'list' }))
    }
  }, [])

  return (
    <TabbedForm warnWhenUnsavedChanges resolver={yupResolver(schema)}>
      <TabbedForm.Tab label='Core'>
        <CoreForm batchId={batchId} />
      </TabbedForm.Tab>
      <TabbedForm.Tab label='Map tape' icon={<GroupWork />} iconPosition='end'>
        <MediaForm type='Tape' source='mag_tape' />
      </TabbedForm.Tab>
      <TabbedForm.Tab label='DVD' icon={<Album />} iconPosition='end'>
        <MediaForm type='DVD' source='dvd' />
      </TabbedForm.Tab>
      <TabbedForm.Tab label='Paper' icon={<MenuBook />} iconPosition='end'>
        <MediaForm type='Paper' source='paper' />
      </TabbedForm.Tab>
    </TabbedForm>
  )
}
