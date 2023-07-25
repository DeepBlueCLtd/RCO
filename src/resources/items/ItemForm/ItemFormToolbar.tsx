import { SaveButton, Toolbar, useNotify } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import FlexBox from '../../../components/FlexBox'
import mitt from 'mitt'
import { useEffect, useState } from 'react'
import { SAVE_EVENT } from '../../../constants'
import { transformProtectionValues } from '../../../utils/helper'
import RemarksBox from '../../../components/RemarksBox'
import { Button } from '@mui/material'
import useVaultLocationAudit from '../../../hooks/useVaultLocationAudit'

// eslint-disable-next-line
type Events = {
  [SAVE_EVENT]: string
}

enum ItemFormSaveType {
  SAVE = 'SAVE',
  CLONE = 'CLONE'
}

let clone = false
let save = false
export const emitter = mitt<Events>()

interface ActionsProps {
  onSuccess: (data: any) => void
  setOpenRemarks: React.Dispatch<boolean>
  vLocationAudits: () => Promise<void>
}

const Actions = (props: ActionsProps): React.ReactElement => {
  const { onSuccess, setOpenRemarks, vLocationAudits } = props

  const onSuccessWithRemarksClose = (data: any): void => {
    onSuccess(data)
    setOpenRemarks(false)
  }

  return (
    <FlexBox>
      <SaveButton
        label='Save'
        type='button'
        onClick={() => vLocationAudits() as any}
        transform={transformProtectionValues}
        mutationOptions={{
          onSuccess: onSuccessWithRemarksClose
        }}
      />
      <Button
        color='secondary'
        variant='outlined'
        onClick={() => {
          setOpenRemarks(false)
        }}>
        Cancel
      </Button>
    </FlexBox>
  )
}

interface Props {
  onSuccess: (data: any) => void
}

const ItemFormToolbar = (props: Props): React.ReactElement => {
  const { onSuccess } = props
  const { reset, getValues } = useFormContext()
  const notify = useNotify()
  const { id } = useParams()
  const [openRemarks, setOpenRemarks] = useState(false)
  const vaultLocationsAudit = useVaultLocationAudit()

  const saveHandler = (e: string): void => {
    if (clone) {
      clone = false
      saveAndClone(e, ItemFormSaveType.CLONE)
    }
    if (save) {
      save = false
      saveAndClone(e, ItemFormSaveType.SAVE)
      reset()
    }
  }

  useEffect(() => {
    emitter.on(SAVE_EVENT, saveHandler)
    return () => {
      emitter.off(SAVE_EVENT, saveHandler)
    }
  }, [])

  const onSave = (event: React.SyntheticEvent): void => {
    event.preventDefault()
    setOpenRemarks(true)
  }

  const vLocationAudits = async (
    vaultLocationId?: number,
    itemId?: number
  ): Promise<void> => {
    await vaultLocationsAudit(
      vaultLocationId ?? getValues('vaultLocation'),
      itemId
    )
  }

  const successWithAudit = ({ id, vaultLocation }: Item): void => {
    vLocationAudits(vaultLocation, id) as any
    onSuccess({ id })
  }

  if (typeof id !== 'undefined') {
    return (
      <Toolbar>
        <RemarksBox
          title='Batch Item editing remarks'
          open={openRemarks}
          actions={
            <Actions
              vLocationAudits={vLocationAudits}
              onSuccess={onSuccess}
              setOpenRemarks={setOpenRemarks}
            />
          }
        />
        <SaveButton label='Save' type='button' onClick={onSave} />
      </Toolbar>
    )
  }

  const saveAndClone = (itemNumber: string, type: ItemFormSaveType): void => {
    notify(
      `Item ${itemNumber} has been saved. Now showing ${
        type === ItemFormSaveType.CLONE ? 'clone of previous' : 'blank'
      } item.`
    )
  }

  return (
    <Toolbar>
      <FlexBox>
        <SaveButton
          type='button'
          label='Create / Clone'
          title='Store this item, then create a new copy'
          onClick={() => {
            clone = true
          }}
          transform={transformProtectionValues}
          mutationOptions={{
            onSuccess: successWithAudit
          }}
        />
        <SaveButton
          type='button'
          label='Create / New'
          title='Store this item, then create a blank item'
          onClick={() => {
            save = true
          }}
          transform={transformProtectionValues}
          mutationOptions={{
            onSuccess: successWithAudit
          }}
        />
      </FlexBox>
    </Toolbar>
  )
}

export default ItemFormToolbar
