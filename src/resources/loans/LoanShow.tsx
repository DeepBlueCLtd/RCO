import { Show, TabbedShowLayout } from 'react-admin'
import LoanForm from './LoanForm'

export default function LoanShow() {
  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label='Details'>
          <LoanForm show />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='Items'>Loan Items</TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  )
}
