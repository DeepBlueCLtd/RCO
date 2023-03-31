import { Album, GroupWork, MenuBook } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  ReferenceInput,
  SelectInput,
  TabbedForm,
  TextInput,
  useCreatePath,
  useRedirect
} from 'react-admin'
import { useLocation, useParams } from 'react-router-dom'
import { isNumber } from '../utils/number'
import DatePicker from './DatePicker'
import FlexBox from './FlexBox'
import { mediaTypeOptions } from '../utils/media'

interface OptionsText {
  name: string
}

const schema = yup.object({
  media_type: yup
    .string()
    .required()
    .oneOf(mediaTypeOptions.map(({ id }) => id)),
  start: yup.string().required(),
  end: yup.string().required(),
  batch_id: yup.number().required(),
  vault_location: yup.number().required(),
  protective_marking: yup.number().required(),
  remarks: yup.string().required()
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

  const defaultValues: Partial<Item> = {
    start: '',
    end: '',
    remarks: '',
    batch_id: batchId
  }

  const sx = { width: '100%' }

  const optionsText = (item: OptionsText) => item.name

  return (
    <TabbedForm defaultValues={defaultValues} resolver={yupResolver(schema)}>
      <TabbedForm.Tab label='Core'>
        <SelectInput source='media_type' choices={mediaTypeOptions} sx={sx} />
        <FlexBox>
          <DatePicker
            source='start'
            label='Start'
            variant='outlined'
            format='YYYY'
            dataPickerProps={{ views: ['year'] }}
          />
          <DatePicker
            source='end'
            variant='outlined'
            label='End'
            format='YYYY'
            dataPickerProps={{ views: ['year'] }}
          />
        </FlexBox>
        <FlexBox>
          <ReferenceInput source='vault_location' reference='vault-location'>
            <SelectInput optionText={optionsText} sx={sx} />
          </ReferenceInput>
          <ReferenceInput
            source='protective_marking'
            reference='protective-marking'>
            <SelectInput optionText={optionsText} sx={sx} />
          </ReferenceInput>
        </FlexBox>
        <TextInput multiline source='remarks' sx={sx} />
        <FlexBox></FlexBox>
      </TabbedForm.Tab>
      <TabbedForm.Tab
        label='Map tape'
        icon={<GroupWork />}
        iconPosition='end'></TabbedForm.Tab>
      <TabbedForm.Tab
        label='DVD'
        icon={<Album />}
        iconPosition='end'></TabbedForm.Tab>
      <TabbedForm.Tab
        label='Paper'
        icon={<MenuBook />}
        iconPosition='end'></TabbedForm.Tab>
    </TabbedForm>
  )
}
