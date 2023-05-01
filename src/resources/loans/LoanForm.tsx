import { yupResolver } from '@hookform/resolvers/yup'
import { DateTime } from 'luxon'
import { DateInput, SimpleForm, TextInput } from 'react-admin'
import * as yup from 'yup'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'

const schema = yup.object({
  createdAt: yup.string().required(),
  holder: yup.number().required(),
  loanedBy: yup.number().required(),
  remarks: yup.string().optional().nullable()
})

interface Props {
  show?: boolean
}

export default function LoanForm(props: Props) {
  const { show } = props

  const defaultValues = {
    createdAt: DateTime.now().toFormat(constants.DATE_FORMAT)
  }

  // to do
  const state = 'Outstanding (4 items remaining)'

  const sx = { width: '100%' }

  return (
    <SimpleForm
      toolbar={show !== undefined ? false : undefined}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <SourceInput
        inputProps={{ disabled: show }}
        source='holder'
        reference={constants.R_USERS}
      />
      <SourceInput
        inputProps={{ disabled: show }}
        source='loanedBy'
        reference={constants.R_USERS}
      />
      <TextInput sx={sx} disabled={show} multiline source='remarks' />
      {show !== undefined && (
        <>
          <TextInput source='state' disabled defaultValue={state} sx={sx} />
          <DateInput sx={sx} source='createdAt' disabled />
        </>
      )}
    </SimpleForm>
  )
}
