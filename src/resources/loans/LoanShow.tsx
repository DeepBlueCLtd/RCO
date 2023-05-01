import { Show, TabbedShowLayout } from 'react-admin'
import LoanItemsList from '../loan-items/LoanItemsList'
import LoanForm from './LoanForm'

export default function LoanShow() {
  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label='Details'>
          <LoanForm show />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='Items'>
          <LoanItemsList />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  )
}
