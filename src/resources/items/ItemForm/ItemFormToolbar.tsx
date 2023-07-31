import { SaveButton, Toolbar } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import FlexBox from '../../../components/FlexBox'
import mitt from 'mitt'
import { useContext, useEffect, useRef, useState } from 'react'
import { SAVE_EVENT } from '../../../constants'
import { transformProtectionValues } from '../../../utils/helper'
import RemarksBox from '../../../components/RemarksBox'
import { Button } from '@mui/material'
import { DateTime } from 'luxon'
import useVaultLocationAudit from '../../../hooks/useVaultLocationAudit'
import { Context as NotificationContext } from '../../../context/NotificationContext'

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
  const { notify } = useContext(NotificationContext)
  const { reset, getValues, setValue } = useFormContext()
  const { id } = useParams()
  const [openRemarks, setOpenRemarks] = useState(false)
  const vaultLocationsAudit = useVaultLocationAudit()
  const saveCloneButtonRef = useRef<any>(null)
  const saveNewButtonRef = useRef<any>(null)

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

  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent): void => {
      if (event.altKey) {
        if (event.key === 'c' && saveCloneButtonRef.current) {
          saveCloneButtonRef.current.focusVisible()
        } else if (event.key === 'n' && saveNewButtonRef.current) {
          saveNewButtonRef.current.focusVisible()
        }
      }
    }

    document.addEventListener('keydown', handleKeyboardShortcuts)

    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts)
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
      } item.`,
      { type: 'success' }
    )
  }
  return (
    <Toolbar>
      <FlexBox>
        <SaveButton
          action={saveCloneButtonRef}
          type='button'
          label='Save / Clone'
          title='Store this item, then create a new copy'
          onClick={() => {
            clone = true
          }}
          transform={transformProtectionValues}
          mutationOptions={{
            onSuccess: (data: Item) => {
              successWithAudit(data)
              setValue('startDate', data.endDate)
              setValue(
                'endDate',
                DateTime.fromISO(data.endDate ?? '')
                  .plus({ days: 1 })
                  .toISO()
              )
            }
          }}
        />
        <SaveButton
          action={saveNewButtonRef}
          type='button'
          label='Save / New'
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
