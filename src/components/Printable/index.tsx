import { Close } from '@mui/icons-material'
import { Box, Button, IconButton, Modal, type ModalProps } from '@mui/material'
import FlexBox from '../FlexBox'

interface Props {
  children?: React.ReactElement | React.ReactElement[]
  onPrint?: () => void
}

const style = {
  background: '#fff',
  '@media print': {
    '@page': {
      size: 'portrait'
    }
  }
}

const buttonSx = {
  position: 'fixed',
  right: '10px',
  top: '10px',
  zIndex: '9'
}

export default function Printable(
  props: Props & ModalProps
): React.ReactElement {
  const { children, onPrint, ...rest } = props

  const handleClose = (): void => {
    rest?.onClose?.({}, 'escapeKeyDown')
  }

  const handlePrint = (): void => {
    if (onPrint) {
      onPrint()
    }
    window.print()
  }

  return (
    <Modal sx={style} hideBackdrop className='printable' {...rest}>
      <Box width='100%' height='100%' overflow='auto'>
        <IconButton sx={buttonSx} onClick={handleClose}>
          <Close />
        </IconButton>
        <Box sx={{ padding: '30px' }}>{children}</Box>
        <FlexBox
          className='noprint'
          marginBottom='20px'
          justifyContent='center'>
          <Button variant='contained' onClick={handlePrint}>
            Print
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </FlexBox>
      </Box>
    </Modal>
  )
}
