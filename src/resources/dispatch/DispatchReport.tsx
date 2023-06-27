import Printable from '../../components/Printable'
import { type ModalState } from './DispatchShow'
import ReportData from './ReportData'
interface Props {
  open: boolean
  handleOpen: (name: ModalState) => void
}

export default function DispatchReport(props: Props): React.ReactElement {
  const { open, handleOpen } = props

  return (
    <Printable
      open={open}
      onClose={() => {
        handleOpen('')
      }}>
      <ReportData />
    </Printable>
  )
}
