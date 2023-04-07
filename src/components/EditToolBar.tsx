import { Box } from '@mui/system'
import React from 'react'
import { DeleteWithConfirmButton, SaveButton, Toolbar } from 'react-admin'

const EditToolBar = (props: FormProps): React.ReactElement => {
  const { isEdit = false } = props
  return (
    <Toolbar>
      <Box display='flex' width='100%' justifyContent='space-between'>
        <SaveButton />
        {isEdit && <DeleteWithConfirmButton />}
      </Box>
    </Toolbar>
  )
}

export default EditToolBar
