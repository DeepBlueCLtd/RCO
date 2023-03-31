import { ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'
import DatePicker from './DatePicker'
import FlexBox from './FlexBox'

interface OptionsText {
  name: string
}

export default function ItemForm() {
  const defaultValues: Partial<Item> = {
    start: '',
    end: '',
    remarks: ''
  }

  const sx = { width: '100%' }

  const optionsText = (item: OptionsText) => item.name

  return (
    <SimpleForm defaultValues={defaultValues}>
      <FlexBox>
        <DatePicker
          source='start'
          label='Start'
          dataPickerProps={{ views: ['year'] }}
        />
        <DatePicker
          source='end'
          label='End'
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
    </SimpleForm>
  )
}
