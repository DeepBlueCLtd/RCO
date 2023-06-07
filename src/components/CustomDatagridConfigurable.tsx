import React from 'react'
import {
  DatagridConfigurable,
  type DatagridConfigurableProps
} from 'react-admin'
import useDoubleClick from '../hooks/useDoubleClick'
import { type ResourceTypes } from '../constants'

export default function CustomDatagridConfigurable(
  props: DatagridConfigurableProps & { resource: ResourceTypes }
): React.ReactElement {
  const { children, resource, ...rest } = props

  const handleRowClick = useDoubleClick(resource)

  return (
    <DatagridConfigurable
      rowClick={(id) => handleRowClick(id as number)}
      {...rest}>
      {children}
    </DatagridConfigurable>
  )
}
