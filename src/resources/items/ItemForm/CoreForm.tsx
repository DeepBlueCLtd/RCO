import { ReferenceInput, SelectInput, TextInput } from 'react-admin'
import { mediaTypeOptions } from '../../../utils/media'
import DatePicker from '../../../components/DatePicker'
import FlexBox from '../../../components/FlexBox'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'

const sx = { width: '100%' }

interface Props {
  batchId?: number
}

const optionsText = (item: ReferenceItem) => item.name

const CoreForm = (props: Props): React.ReactElement => {
  const { batchId } = props
  const formContext = useFormContext()

  useEffect(() => {
    formContext?.setValue('batch_id', batchId)
  }, [batchId])

  return (
    <>
      <SelectInput source='media_type' choices={mediaTypeOptions} sx={sx} />
      <FlexBox>
        <DatePicker source='start' label='Start' variant='outlined' />
        <DatePicker source='end' variant='outlined' label='End' />
      </FlexBox>
      <FlexBox>
        <ReferenceInput source='vault_location' reference='vaultLocation'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
        <ReferenceInput
          source='protective_marking'
          reference='protectiveMarking'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
      </FlexBox>
      <TextInput multiline source='remarks' sx={sx} />
    </>
  )
}

export default CoreForm
