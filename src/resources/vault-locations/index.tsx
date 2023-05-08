import { Download } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { useState } from 'react'
import { Create, Edit, TopToolbar } from 'react-admin'
import Printable from '../../components/Printable'
import VaultReport from './VaultReport'
import VaultLocationForm from './VaultLocationForm'
import VaultLocationList from './VaultLocationList'

const VaultLocationCreate = (): React.ReactElement => {
  return (
    <Create>
      <VaultLocationForm />
    </Create>
  )
}

export const VaultLocationEdit = (): React.ReactElement => {
  const EditActions = (): React.ReactElement => {
    const [open, setOpen] = useState(false)

    const handleClose = (): void => {
      setOpen(false)
    }

    const handleOpen = (): void => {
      setOpen(true)
    }

    return (
      <>
        <TopToolbar>
          <Button
            startIcon={<Download />}
            sx={{ lineHeight: '1.5' }}
            size='small'
            onClick={handleOpen}>
            Muster list
          </Button>
        </TopToolbar>
        <Printable open={open} onClose={handleClose}>
          <VaultReport />
        </Printable>
      </>
    )
  }

  return (
    <Edit actions={<EditActions />}>
      <VaultLocationForm />
    </Edit>
  )
}

const vaultLocations = {
  create: VaultLocationCreate,
  edit: VaultLocationEdit,
  list: VaultLocationList
}

export default vaultLocations
