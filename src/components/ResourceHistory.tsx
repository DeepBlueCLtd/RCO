import AuditList, { type FilterType } from '../resources/audit/AuditList'
import Printable from './Printable'

interface ResourceHistoryProps {
  filter?: FilterType
  open: any
  close: any
  data?: Audit[]
}

const ResourceHistoryModal = ({
  filter,
  open,
  close,
  data
}: ResourceHistoryProps): React.ReactElement => {
  return (
    <Printable open={open} onClose={close}>
      <AuditList filter={filter} data={data} />
    </Printable>
  )
}

export default ResourceHistoryModal
