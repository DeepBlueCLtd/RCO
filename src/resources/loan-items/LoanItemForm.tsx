import { SimpleForm, TextInput, DateInput } from 'react-admin'
import SourceInput from '../../components/SourceInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { DateTime } from 'luxon'
import * as constants from '../../constants'
import * as yup from 'yup'

const schema = yup.object({
  createdAt: yup.string().required(),
  item: yup.number().required(),
  loan: yup.number().required(),
  receivedBy: yup.number().required(),
  returnedDate: yup.string().required(),
  remarks: yup.string().optional().nullable()
})

interface Props {
  show?: boolean
  loan?: number
}

export default function LoanItemForm(props: Props) {
  const { show, loan } = props

  const defaultValues = {
    createdAt: DateTime.now().toFormat(constants.DATE_FORMAT),
    loan
  }

  const sx = { width: '100%' }
  const disabledLoan = show !== undefined || loan !== undefined

  return (
    <SimpleForm
      toolbar={show !== undefined ? false : undefined}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <SourceInput<Item>
        inputProps={{ disabled: show }}
        source='item'
        optionField='item_number'
        reference={constants.R_ITEMS}
      />
      <SourceInput<Loan>
        inputProps={{ disabled: disabledLoan }}
        sort={{ field: 'id', order: 'ASC' }}
        source='loan'
        optionField='id'
        reference={constants.R_LOANS}
      />
      <SourceInput<User>
        inputProps={{ disabled: show }}
        source='receivedBy'
        reference={constants.R_USERS}
      />
      <DateInput sx={sx} source='returnedDate' />
      <TextInput sx={sx} disabled={show} multiline source='remarks' />
    </SimpleForm>
  )
}
