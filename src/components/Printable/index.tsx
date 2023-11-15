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
      size: 'portrait',
      margin: '2mm'
    },
    '& .MuiBox-root .RaShow-card .MuiTypography-h4': {
      fontSize: '18px'
    },
    '& .MuiBox-root .RaShow-card .MuiTypography-h5,.MuiBox-root .RaShow-card .MuiTypography-h5 span':
      {
        fontSize: '16px'
      },
    '& .MuiBox-root .MuiTypography-root': {
      fontSize: '12px'
    },
    '& .RaDatagrid-rowCell, .RaDatagrid-headerCell': {
      padding: '0 !important;'
    },
    '& .RaDatagrid-rowCell *, .RaDatagrid-headerCell *': {
      fontSize: '12px !important'
    }
  }
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
      <Box width='100%' height='100%' display='flex' flexDirection='column'>
        <Box
          display='flex'
          justifyContent='center'
          marginBottom='10px'
          position='relative'>
          <Box position='absolute' top='10px' right='10px'>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ padding: '30px', overflowY: 'auto' }}>{children}</Box>
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
