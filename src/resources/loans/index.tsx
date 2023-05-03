import React from 'react'
import { Create, type CreateProps, Edit } from 'react-admin'
import LoanForm, { type LoanFormProps } from './LoanForm'
import * as constants from '../../constants'

const LoanList = React.lazy(async () => await import('./LoanList'))
const LoanShow = React.lazy(async () => await import('./LoanShow'))

type LoanCreateProps = CreateProps & { loanFormProps?: LoanFormProps }
export function LoanCreate(props: LoanCreateProps): React.ReactElement {
  return (
    <Create resource={constants.R_LOANS} {...props}>
      <LoanForm {...props.loanFormProps} />
    </Create>
  )
}

function LoanEdit(): React.ReactElement {
  return (
    <Edit>
      <LoanForm />
    </Edit>
  )
}

export default {
  create: LoanCreate,
  edit: LoanEdit,
  list: LoanList,
  show: LoanShow
}
