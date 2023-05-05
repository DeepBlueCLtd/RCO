import { yupResolver } from '@hookform/resolvers/yup'
import {
  DateInput,
  SimpleForm,
  TextInput,
  useGetIdentity,
  Toolbar,
  SaveButton
} from 'react-admin'
import * as yup from 'yup'
import SourceInput from './SourceInput'
import * as constants from '../constants'

const schema = yup.object({
  holder: yup.number().required(),
  loanedBy: yup.number().required(),
  remarks: yup.string().required()
})

export interface LoanFormProps {
  show?: boolean
  defaultValues?: Partial<Loan>
  hidefields?: Array<keyof Loan>
  onSubmit?: (data: any) => void
}

export default function LoanForm(props: LoanFormProps): React.ReactElement {
  const { show, defaultValues: defaultFormValues, hidefields = [] } = props

  const { data } = useGetIdentity()

  const defaultValues: Partial<Loan> = {
    loanedBy: data?.id as number,
    ...defaultFormValues
  }

  const sx = { width: '100%' }

  const ToolBar = (): React.ReactElement => (
    <Toolbar>
      <SaveButton label='Loan' />
    </Toolbar>
  )

  return (
    <SimpleForm
      toolbar={show !== undefined ? false : <ToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}
      {...props}>
      {!hidefields.includes('holder') && (
        <SourceInput
          inputProps={{ disabled: show }}
          source='holder'
          reference={constants.R_USERS}
        />
      )}
      {!hidefields.includes('loanedBy') && (
        <SourceInput
          inputProps={{ disabled: show }}
          source='loanedBy'
          reference={constants.R_USERS}
        />
      )}
      <TextInput sx={sx} disabled={show} multiline source='remarks' />
      {show !== undefined && (
        <>
          <DateInput sx={sx} source='createdAt' disabled />
        </>
      )}
    </SimpleForm>
  )
}
