import { Box } from '@mui/system'
import React from 'react'
import { SaveButton, type SaveButtonProps, Toolbar } from 'react-admin'

const EditToolBar = (
  props: SaveButtonProps & { isValid?: boolean }
): React.ReactElement => {
  const { isValid, ...saveButtonProps } = props

  return (
    <Toolbar>
      <Box display='flex' width='100%' justifyContent='space-between'>
        <SaveButton
          {...saveButtonProps}
          disabled={saveButtonProps.onClick !== undefined && !isValid}
        />
      </Box>
    </Toolbar>
  )
}

export default EditToolBar
