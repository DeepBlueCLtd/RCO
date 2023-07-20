import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import FlexBox from './FlexBox'

interface Props {
  title: string
  open: boolean
  onCancel: () => void
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function RemarksBox(props: Props): React.ReactElement {
  const { title, onCancel, ...rest } = props

  return (
    <Modal {...rest}>
      <Box sx={style}>
        <Typography fontSize={20} fontWeight={500}>
          {title}
        </Typography>
        <TextField
          id='outlined-basic'
          label='Remarks here'
          variant='outlined'
          //   {...register('remarks')}
          multiline
          rows={4}
          sx={{
            width: '100%'
          }}
        />
        <FlexBox justifyContent='space-around' mt={2}>
          <Button variant='contained' disabled={false}>
            Save
          </Button>
          <Button color='secondary' variant='outlined' onClick={onCancel}>
            Cancel
          </Button>
        </FlexBox>
      </Box>
    </Modal>
  )
}
