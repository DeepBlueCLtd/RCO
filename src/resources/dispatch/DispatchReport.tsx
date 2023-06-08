import Printable from '../../components/Printable'
import ReportData from './ReportData'
interface Props {
  open: boolean
  handleOpen: (name: string) => void
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
