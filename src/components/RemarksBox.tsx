import { Box, Modal, Typography } from '@mui/material'
import React from 'react'
import { TextInput } from 'react-admin'

interface Props {
  title: string
  open: boolean
  actions?: React.ReactElement
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
  const { title, actions, open } = props

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Typography fontSize={20} fontWeight={500}>
          {title}
        </Typography>
        <TextInput
          multiline
          variant='outlined'
          placeholder='Remarks here'
          source='editRemarks'
          rows={4}
          sx={{
            width: '100%'
          }}
        />
        {actions}
      </Box>
    </Modal>
  )
}
