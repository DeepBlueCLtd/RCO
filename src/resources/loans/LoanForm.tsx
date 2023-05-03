import { yupResolver } from '@hookform/resolvers/yup'
import { DateTime } from 'luxon'
import { useEffect, useMemo, useState } from 'react'
import {
  DateInput,
  SimpleForm,
  TextInput,
  useDataProvider,
  useGetIdentity,
  Toolbar,
  SaveButton
} from 'react-admin'
import { useParams } from 'react-router-dom'
import * as yup from 'yup'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'

const schema = yup.object({
  createdAt: yup.string().required(),
  holder: yup.number().required(),
  loanedBy: yup.number().required(),
  remarks: yup.string().optional().nullable()
})

export interface LoanFormProps {
  show?: boolean
  defaultValues?: Partial<Loan>
  hideFields?: Array<keyof Loan>
}

export default function LoanForm(props: LoanFormProps) {
  const { show, defaultValues: defaultFormValues, hideFields = [] } = props

  const [loanItems, setLoanItems] = useState<LoanItem[]>([])
  const dataProvider = useDataProvider()
  const { id } = useParams()
  const { data } = useGetIdentity()

  const defaultValues: Partial<Loan> = {
    createdAt: DateTime.now().toFormat(constants.DATE_FORMAT),
    loanedBy: data?.id as number,
    ...defaultFormValues
  }

  const state = useMemo(() => {
    if (loanItems.length === 0) return 'Returned'

    return `Outstanding (${loanItems.length} items remaining)`
  }, [loanItems])

  const sx = { width: '100%' }

  useEffect(() => {
    dataProvider
      .getList<LoanItem>(constants.R_LOAN_ITEMS, {
        filter: { loan: id, returnedDate: undefined },
        sort: { field: 'id', order: 'ASC' },
        pagination: { perPage: 1000, page: 1 }
      })
      .then(({ data }) => {
        setLoanItems(data)
      })
      .catch(console.log)
  }, [])

  const ToolBar = () => (
    <Toolbar>
      <SaveButton label='Loan' />
    </Toolbar>
  )

  return (
    <SimpleForm
      toolbar={show !== undefined ? false : <ToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      {!hideFields.includes('holder') && (
        <SourceInput
          inputProps={{ disabled: show }}
          source='holder'
          reference={constants.R_USERS}
        />
      )}
      {!hideFields.includes('loanedBy') && (
        <SourceInput
          inputProps={{ disabled: show }}
          source='loanedBy'
          reference={constants.R_USERS}
        />
      )}
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
