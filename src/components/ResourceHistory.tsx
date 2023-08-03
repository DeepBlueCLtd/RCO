import AuditList, { type FilterType } from '../resources/audit/AuditList'
import Printable from './Printable'
import { ListActions } from '../resources/audit/AuditList'
import { Button, type ButtonProps } from '@mui/material'
import { Download } from '@mui/icons-material'
import { useRedirect, useResourceContext } from 'react-admin'
import { useParams } from 'react-router-dom'

interface ResourceHistoryProps {
  filter?: FilterType
  open: any
  close: any
  data?: Audit[]
}

const FullAuditListButton = (props: ButtonProps): React.ReactElement => {
  return (
    <Button
      startIcon={<Download />}
      sx={{ lineHeight: '1.5' }}
      size='small'
      {...props}>
      Full Report
    </Button>
  )
}

const ResourceHistoryModal = ({
  filter,
  open,
  close,
  data
}: ResourceHistoryProps): React.ReactElement => {
  const redirect = useRedirect()
  const resource = useResourceContext()
  const { id } = useParams()
  const showFullReport = (): void => {
    const path = `/audit?filter=${JSON.stringify({ resource, dataId: id })}`
    redirect(path)
  }

  return (
    <Printable open={open} onClose={close}>
      <AuditList
        filter={{
          // note: don't filter the activities shown in the audit log
          // activityType: [
          //   AuditType.EDIT,
          //   AuditType.SENT,
          //   AuditType.DESTROY,
          //   AuditType.LOAN
          // ],
          ...filter
        }}
        data={data}
        omit={['resource', 'dataId', 'securityRelated', 'subject']}
        actions={
          <ListActions
            buttons={<FullAuditListButton onClick={showFullReport} />}
          />
        }
      />
    </Printable>
  )
}

export default ResourceHistoryModal
