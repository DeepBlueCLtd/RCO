import React from 'react'
import {
  DatagridConfigurable,
  ShowButton,
  type DatagridConfigurableProps,
  useRecordContext,
  useRedirect
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

  const PreviewButton = (): React.ReactElement => {
    const { id } = useRecordContext()
    const redirect = useRedirect()

    const handleClick = (): void => {
      const path = `/${resource}/${id}/show`
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
      {children}
      <ShowButton component={PreviewButton} />
    </DatagridConfigurable>
  )
}
