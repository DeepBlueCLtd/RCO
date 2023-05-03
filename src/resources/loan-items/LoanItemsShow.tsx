import { Show } from 'react-admin'
import LoanItemForm from './LoanItemForm'

export default function LoanItemShow(): React.ReactElement {
  return (
    <Show>
      <LoanItemForm show />
    </Show>
  )
}
