import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  type ModalProps
} from '@mui/material'
import FlexBox from '../FlexBox'
import { useConfigData } from '../../utils/useConfigData'

interface Props {
  children?: React.ReactElement | React.ReactElement[]
  onPrint?: () => void
}

const style = {
  background: '#fff',
  '@media print': {
    '@page': {
      size: 'portrait'
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

const Header = ({
  configData
}: {
  configData: ConfigData | undefined
}): React.ReactElement => {
  return (
    <Box textAlign='center' marginBottom={2}>
      <Typography variant='caption'>{configData?.headerMarking}</Typography>
    </Box>
  )
}

const Footer = ({
  configData
}: {
  configData: ConfigData | undefined
}): React.ReactElement => {
  return (
    <Box
      position='fixed'
      left={0}
      right={0}
      bottom={0}
      textAlign='center'
      width='100%'
      bgcolor='white'
      zIndex={1000}>
      <Typography variant='caption'>{configData?.headerMarking}</Typography>
    </Box>
  )
}

export default function Printable(
  props: Props & ModalProps
): React.ReactElement {
  const { children, onPrint, ...rest } = props
  const configData = useConfigData()

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
          <Header configData={configData} />
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
        <Footer configData={configData} />
      </Box>
    </Modal>
  )
}
