import { Download } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { useState } from 'react'
import { Create, Edit, TopToolbar } from 'react-admin'
import Printable from '../../components/Printable'
import ReferenceDataForm from './ReferenceDataForm'
import VaultReport from './VaultReport'

interface PropType {
  name: string
}

const RerferenceDataCreate = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  return (
    <Create redirect={`/reference-data/${cName}`}>
      <ReferenceDataForm />
    </Create>
  )
}

export const ReferenceDataEdit = ({ name }: PropType): React.ReactElement => {
  const cName: string = name

  const EditActions = (): React.ReactElement => {
    const [open, setOpen] = useState(false)

    const handleClose = () => {
      setOpen(false)
    }

    const handleOpen = () => {
      setOpen(true)
    }

    if (cName !== 'vaultLocation') return <></>

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
    <Edit redirect={`/reference-data/${cName}`} actions={<EditActions />}>
      <ReferenceDataForm isEdit name={cName} />
    </Edit>
  )
}
export default RerferenceDataCreate
