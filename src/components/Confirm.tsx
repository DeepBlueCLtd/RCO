import { Dialog, DialogActions, Button, DialogContent } from '@mui/material'
import FlexBox from './FlexBox'
import React from 'react'

interface Props {
  onClose?: () => void
  onOk?: () => void
  open: boolean
  children?: React.ReactElement
}

export default function Confirm(props: Props): React.ReactElement {
  const { open, onClose, onOk, children } = props

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <FlexBox justifyContent='end' padding={1}>
          <Button variant='outlined' autoFocus onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={onOk}>
            Confirm
          </Button>
        </FlexBox>
      </DialogActions>
    </Dialog>
  )
}
