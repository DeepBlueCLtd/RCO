import React from 'react'
import {
  DatagridConfigurable,
  type DatagridConfigurableProps,
  useRecordContext,
  useRedirect,
  useCreatePath
} from 'react-admin'
import useRowClick from '../hooks/useRowClick'
import { type ResourceTypes } from '../constants'
import { Preview } from '@mui/icons-material'
import { ButtonBase } from '@mui/material'

export default function DatagridConfigurableWithShow(
  props: DatagridConfigurableProps & { resource: ResourceTypes }
): React.ReactElement {
  const { children, resource, ...rest } = props

  const handleRowClick = useRowClick(resource)
  const createPath = useCreatePath()

  const PreviewButton = (): React.ReactElement => {
    const { id } = useRecordContext()
    const redirect = useRedirect()

    const handleClick = (): void => {
      const path = createPath({ resource, type: 'show', id })
      redirect(path)
    }

    return (
      <ButtonBase onClick={handleClick}>
        <Preview />
      </ButtonBase>
    )
  }

  return (
    <DatagridConfigurable
      rowClick={(id) => handleRowClick(id as number)}
      {...rest}>
      <PreviewButton />
      {children}
    </DatagridConfigurable>
  )
}
