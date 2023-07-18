import React from 'react'
import { type ToolbarProps, TopToolbar, useStore } from 'react-admin'

interface Props extends ToolbarProps {
  children: React.ReactElement | React.ReactElement[]
  preferenceKey?: string
  columnsFit?: number
}

export default function StyledTopToolbar(props: Props): React.ReactElement {
  const { preferenceKey = '', columnsFit = 10, ...rest } = props

  const [columnsSelected] = useStore<any[]>(
    `preferences.${preferenceKey}.columns`
  )

  const sx = {
    flex: columnsSelected?.length > columnsFit ? 4.5 : 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start'
  }

  return <TopToolbar sx={sx} {...rest} />
}
