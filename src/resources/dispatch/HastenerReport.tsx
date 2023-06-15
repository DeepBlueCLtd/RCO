import { Typography } from '@mui/material'
import Printable from '../../components/Printable'
import ReportData from './ReportData'
import { Box } from '@mui/system'
import { Show, useRecordContext } from 'react-admin'

const BottomText = (): React.ReactElement => {
  const { dispatchedAt } = useRecordContext()

  return (
    <Typography padding='20px'>
      As addressee for this material, you should have received an original
      receipt note (dated {dispatchedAt}) with the documents sent. You are
      required to confirm receipt within 10 working days.
    </Typography>
  )
}

interface Props {
  open: boolean
  handleOpen: (name: string) => void
}
export default function HastenerReport(props: Props): React.ReactElement {
  const { open, handleOpen } = props
  const title = 'Hastener Receipt Note'

  return (
    <Printable
      open={open}
      onClose={() => {
        handleOpen('')
      }}>
      <Box>
        <ReportData title={title} />
        <Show component={'div'} actions={<></>}>
          <BottomText />
        </Show>
      </Box>
    </Printable>
  )
}
