import { Box } from '@mui/system'
import React from 'react'
import { SaveButton, type SaveButtonProps, Toolbar } from 'react-admin'

const EditToolBar = (props: SaveButtonProps): React.ReactElement => {
  return (
    <Toolbar>
      <Box display='flex' width='100%' justifyContent='space-between'>
        <SaveButton {...props} />
      </Box>
    </Toolbar>
  )
}

export default EditToolBar
