import AuditList, { type FilterType } from '../resources/audit/AuditList'
import Printable from './Printable'

interface ResourceHistoryProps {
  filter?: FilterType
  open: any
  close: any
}

const ResourceHistoryModal = ({
  filter,
  open,
  close
}: ResourceHistoryProps): React.ReactElement => {
  return (
    <Printable open={open} onClose={close}>
      <AuditList filter={filter} />
    </Printable>
  )
}

export default ResourceHistoryModal
