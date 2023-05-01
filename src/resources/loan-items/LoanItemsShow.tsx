import { Show, TabbedShowLayout } from 'react-admin'
import LoanItemForm from './LoanItemForm'

export default function LoanItemShow() {
  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label='Details'>
          <LoanItemForm show />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  )
}
