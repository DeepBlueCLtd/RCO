import { SaveButton, Toolbar, useRedirect } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useLocation, useParams } from 'react-router-dom'
import FlexBox from '../../../components/FlexBox'
import mitt from 'mitt'
import { useContext, useEffect, useRef, useState } from 'react'
import { ITEM_CLONE, ITEM_SAVE, SAVE_EVENT } from '../../../constants'
import { transformProtectionValues } from '../../../utils/helper'
import RemarksBox from '../../../components/RemarksBox'
import { Button, type ButtonBaseActions } from '@mui/material'
import { DateTime } from 'luxon'
import useVaultLocationAudit from '../../../hooks/useVaultLocationAudit'
import { Context as NotificationContext } from '../../../context/NotificationContext'
import * as constants from '../../../constants'

// eslint-disable-next-line
type Events = {
  [SAVE_EVENT]: string
  [ITEM_CLONE]: null
  [ITEM_SAVE]: null
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
  onSave: (event: React.SyntheticEvent) => void
  setOpenRemarks: React.Dispatch<boolean>
  openRemarks: boolean
  isEdit: boolean
}

const ItemFormToolbar = (props: Props): React.ReactElement => {
  const { onSuccess, onSave, openRemarks, setOpenRemarks, isEdit } = props
  const { notify } = useContext(NotificationContext)
  const { reset, getValues, setValue } = useFormContext()
  const [alwaysEnable, setAlwaysEnable] = useState(false)

  const { id } = useParams()
  const vaultLocationsAudit = useVaultLocationAudit()
  const saveCloneButtonRef = useRef<ButtonBaseActions>(null)
  const saveNewButtonRef = useRef<ButtonBaseActions>(null)
  const redirect = useRedirect()
  const location = useLocation()

  const saveHandler = (e: string): void => {
    if (clone) {
      clone = false
      setAlwaysEnable(true)
      saveAndClone(e, ItemFormSaveType.CLONE)
      emitter.emit(ITEM_CLONE, null)
    }
    if (save) {
      save = false
      setAlwaysEnable(false)
      saveAndClone(e, ItemFormSaveType.SAVE)
      emitter.emit(ITEM_SAVE, null)
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

  const vLocationAudits = async (
    vaultLocationId?: number | null,
    itemId?: number,
    clone = false
  ): Promise<void> => {
    const searchParams = new URLSearchParams(location.search)
    const batchId = parseInt(searchParams.get('batch') as string)
    const path = `/${constants.R_RICH_ITEMS}/create?batch=${batchId}`

    await vaultLocationsAudit(
      vaultLocationId ?? getValues('vaultLocation'),
      itemId
    )
    setTimeout(() => {
      if (!clone && !isEdit) {
        redirect(path)
      }
    }, 0)
  }

  const successWithAudit = (
    { id, vaultLocation }: Item,
    clone = false
  ): void => {
    vLocationAudits(vaultLocation, id, clone) as any
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

  function incrementFormat(input: string): string {
    return input.replace(
      /(\D*)(\b\d{1,3}\b)/,
      (_: string, other: string, num: string) => {
        return other + (Number(num) + 1).toString().padStart(num.length, '0')
      }
    )
  }

  return (
    <Toolbar>
      <FlexBox>
        <SaveButton
          action={saveCloneButtonRef}
          type='button'
          label='Save / Clone <alt + c>'
          title='Store this item, then create a new copy'
          alwaysEnable={alwaysEnable}
          onClick={() => {
            clone = true
          }}
          transform={transformProtectionValues}
          mutationOptions={{
            onSuccess: (data: Item) => {
              successWithAudit(data, true)
              setValue('startDate', data.endDate)
              setValue(
                'endDate',
                DateTime.fromISO(data.endDate ?? '')
                  .plus({ days: 1 })
                  .toISO()
              )
              const cSheets = getValues('consecSheets')
              if (cSheets) {
                setValue('consecSheets', incrementFormat(cSheets))
              }
            }
          }}
        />
        <SaveButton
          action={saveNewButtonRef}
          alwaysEnable={alwaysEnable}
          type='button'
          label='Save / New <alt + n>'
          title='Store this item, then create a blank item'
          onClick={() => {
            save = true
          }}
          transform={transformProtectionValues}
          mutationOptions={{
            onSuccess: (data: Item) => {
              successWithAudit(data)
            }
          }}
        />
      </FlexBox>
    </Toolbar>
  )
}

export default ItemFormToolbar
