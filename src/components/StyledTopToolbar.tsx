import React from 'react'
import { type ToolbarProps, TopToolbar } from 'react-admin'
import useOverflow from '../hooks/useOverflow'

interface Props extends ToolbarProps {
  children: React.ReactElement | React.ReactElement[]
  preferenceKey?: string
}

export default function StyledTopToolbar(props: Props): React.ReactElement {
  const { preferenceKey = '', ...rest } = props
  const { overflow } = useOverflow('#root', preferenceKey)

  const sx = {
    flex: overflow ? 4.5 : 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start'
  }

  return <TopToolbar sx={sx} {...rest} />
}
