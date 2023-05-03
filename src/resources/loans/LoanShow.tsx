import { Show, TabbedShowLayout } from 'react-admin'
import { useParams } from 'react-router-dom'
import LoanItemsList from '../loan-items/LoanItemsList'
import LoanForm from './LoanForm'

export default function LoanShow(): React.ReactElement {
  const { id } = useParams()

  const loan: string | undefined = id

  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label='Details'>
          <LoanForm show />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='Items'>
          <LoanItemsList filter={{ loan }} />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  )
}
