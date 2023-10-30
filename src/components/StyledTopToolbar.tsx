import React from 'react'
import { type ToolbarProps, TopToolbar } from 'react-admin'

interface Props extends ToolbarProps {
  children: React.ReactElement | React.ReactElement[]
}

export default function StyledTopToolbar(props: Props): React.ReactElement {
  const sx = {
    flex: 4.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start'
  }

  return <TopToolbar sx={sx} {...props} />
}
