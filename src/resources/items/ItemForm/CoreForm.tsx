import {
  DateTimeInput,
  ReferenceInput,
  SelectInput,
  TextInput
} from 'react-admin'
import { mediaTypeOptions } from '../../../utils/media'
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
    formContext?.setValue('batchId', batchId)
  }, [batchId])

  return (
    <>
      <SelectInput source='mediaType' choices={mediaTypeOptions} sx={sx} />
      <FlexBox>
        <DateTimeInput
          sx={sx}
          source='start'
          label='Start'
          variant='outlined'
        />
        <DateTimeInput sx={sx} source='end' variant='outlined' label='End' />
      </FlexBox>
      <FlexBox>
        <ReferenceInput source='vaultLocation' reference='vaultLocation'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
        <ReferenceInput
          source='protectiveMarking'
          reference='protectiveMarking'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
      </FlexBox>
      <TextInput multiline source='remarks' sx={sx} />
    </>
  )
}

export default CoreForm
