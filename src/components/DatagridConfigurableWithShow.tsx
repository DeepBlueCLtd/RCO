import React from 'react'
import {
  DatagridConfigurable,
  type DatagridConfigurableProps,
  useRecordContext,
  useRedirect,
  useCreatePath,
  useListContext
} from 'react-admin'
import useRowClick from '../hooks/useRowClick'
import { type ResourceTypes } from '../constants'
import { Preview, Link } from '@mui/icons-material'
import { ButtonBase } from '@mui/material'

const PreviewButton = ({
  resource
}: {
  resource: ResourceTypes
}): React.ReactElement => {
  const { id } = useRecordContext()
  const redirect = useRedirect()
  const createPath = useCreatePath()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (resource === 'richItem') {
      if (event.ctrlKey || event.button === 1) {
        window.open(`/#/${resource}/${id}/show`, '_blank')
      }
    } else {
      if (!(event.ctrlKey || event.button === 1)) {
        const path = createPath({ resource, type: 'show', id })
        redirect(path)
      }
    }
  }

  return (
    <ButtonBase onClick={handleClick}>
      {resource === 'richItem'  ? <Link /> : <Preview />}
    </ButtonBase>
  )
}

interface Props {
  resource: ResourceTypes
  storeKey?: string | false
}

export default function DatagridConfigurableWithShow(
  props: DatagridConfigurableProps & Props
): React.ReactElement {
  const { children, resource, storeKey = '', ...rest } = props

  const handleRowClick = useRowClick(resource)
  const { selectedIds } = useListContext()

  const itemsStoreKeys = ['filtered-item-list', 'items-items-list']

  const styles = {
    '& div .RaBulkActionsToolbar-toolbar,.RaBulkActionsToolbar-collapsed': {
      minHeight: '48px',
      height: '48px',
      position: 'relative',
      transform: 'none',
      justifyContent: 'flex-start',
      '& .RaBulkActionsToolbar-title': {
        display: selectedIds.length > 0 ? 'flex' : 'none'
      },
      '& .MuiBox-root': {
        width: 'auto'
      }
    }
  }
  const sx = itemsStoreKeys.includes(storeKey as string) ? styles : null

  return (
    <DatagridConfigurable
      sx={sx}
      rowClick={(id) => handleRowClick(id as number)}
      {...rest}>
      <PreviewButton resource={resource} />
      {children}
    </DatagridConfigurable>
  )
}
