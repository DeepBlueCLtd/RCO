import React from 'react'
import { Create, Edit } from 'react-admin'
import LoanForm from './LoanForm'

const LoanList = React.lazy(async () => await import('./LoanList'))
const LoanShow = React.lazy(async () => await import('./LoanShow'))

function LoanCreate(): React.ReactElement {
  return (
    <Create>
      <LoanForm />
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
