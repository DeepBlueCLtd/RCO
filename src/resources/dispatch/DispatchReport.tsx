import Printable from '../../components/Printable'
import { type DestructionModal } from './DispatchShow'
import ReportData from './ReportData'
interface Props {
  open: boolean
  handleOpen: (name: DestructionModal) => void
  onPrint?: () => void
}

export default function DispatchReport(props: Props): React.ReactElement {
  const { handleOpen, ...rest } = props

  return (
    <Printable
      {...rest}
      onClose={() => {
        handleOpen('')
      }}>
      <ReportData />
    </Printable>
  )
}
