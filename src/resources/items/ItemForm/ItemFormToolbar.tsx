import { SaveButton, Toolbar, useNotify } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import FlexBox from '../../../components/FlexBox'
import mitt from 'mitt'
import { useEffect } from 'react'
import { SAVE_EVENT } from '../../../constants'
import useCatCaveDB from '../../../hooks/useCatCaveDB'

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
const ItemFormToolbar = (): React.ReactElement => {
  const { reset } = useFormContext()
  const notify = useNotify()
  const { id } = useParams()
  const { createRecord, updateRecord } = useCatCaveDB()

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

  if (typeof id !== 'undefined') {
    return (
      <Toolbar>
        <SaveButton label='Save' onClick={updateRecord as any} />
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
          label='Save and clone'
          onClick={(ev: React.MouseEvent<HTMLElement>) => {
            clone = true
            createRecord(ev) as any
          }}
          mutationOptions={{
            onSuccess: () => {}
          }}
        />
        <SaveButton
          type='button'
          label='Save and Create'
          onClick={(ev: React.MouseEvent<HTMLElement>) => {
            save = true
            createRecord(ev) as any
          }}
          mutationOptions={{
            onSuccess: () => {}
          }}
        />
      </FlexBox>
    </Toolbar>
  )
}

export default ItemFormToolbar
