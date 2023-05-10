import { Box } from '@mui/system'
import React from 'react'
import { SaveButton, Toolbar } from 'react-admin'

const EditToolBar = (): React.ReactElement => {
  return (
    <Toolbar>
      <Box display='flex' width='100%' justifyContent='space-between'>
        <SaveButton />
      </Box>
    </Toolbar>
  )
}

export default EditToolBar
