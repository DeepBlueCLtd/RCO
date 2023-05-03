import React, { useEffect } from 'react'
import {
  Create,
  Edit,
  useCreatePath,
  useDataProvider,
  useNotify,
  useRedirect
} from 'react-admin'
import { useLocation } from 'react-router-dom'
import { isNumber } from '../../utils/number'
import LoanItemForm from './LoanItemForm'
import * as constants from '../../constants'

const LoanItemsList = React.lazy(async () => await import('./LoanItemsList'))
const LoanItemsShow = React.lazy(async () => await import('./LoanItemsShow'))

function LoanItemsCreate(): React.ReactElement {
  const location = useLocation()
  const redirect = useRedirect()
  const createPath = useCreatePath()
  const dataProvider = useDataProvider()
  const notify = useNotify()

  const searchParams = new URLSearchParams(location.search)
  const loan = searchParams.get('loan')

  const redirectPath: string = createPath({
    resource: constants.R_LOANS,
    type: 'list'
  })

  const getLoan = async (): Promise<void> => {
    try {
      const isValidNumber = isNumber(loan)
      if (isValidNumber) {
        const { data } = await dataProvider.getOne<Loan>(constants.R_LOANS, {
          id: loan
        })
        if (typeof data === 'undefined') redirect(redirectPath)
      } else {
        redirect(redirectPath)
      }
    } catch (error: any) {
      notify(error.message, { type: 'error' })
    }
  }
  useEffect(() => {
    getLoan().catch(console.log)
  }, [])

  return (
    <Create>
      <LoanItemForm loan={Number(loan)} />
    </Create>
  )
}

function LoanItemsEdit(): React.ReactElement {
  return (
    <Edit>
      <LoanItemForm />
    </Edit>
  )
}

export default {
  create: LoanItemsCreate,
  edit: LoanItemsEdit,
  list: LoanItemsList,
  show: LoanItemsShow
}
