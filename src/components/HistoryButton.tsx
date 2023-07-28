import { History } from '@mui/icons-material'
import { Button, type ButtonProps } from '@mui/material'

export default function HistoryButton(props: ButtonProps): React.ReactElement {
  return (
    <Button
      {...props}
      sx={{ fontSize: '12px' }}
      variant='text'
      startIcon={<History />}>
      History
    </Button>
  )
}
