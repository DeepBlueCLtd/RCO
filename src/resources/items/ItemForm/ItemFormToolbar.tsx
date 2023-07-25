import { SaveButton, Toolbar } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import FlexBox from '../../../components/FlexBox'
import mitt from 'mitt'
import { useContext, useEffect } from 'react'
import { SAVE_EVENT } from '../../../constants'
import { transformProtectionValues } from '../../../utils/helper'
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

interface Props {
  onSuccess: (data: any) => void
}

const ItemFormToolbar = (props: Props): React.ReactElement => {
  const { onSuccess } = props
  const { reset } = useFormContext()
  const { notify } = useContext(NotificationContext)
  const { id } = useParams()

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
        <SaveButton
          label='Save'
          type='button'
          transform={transformProtectionValues}
          mutationOptions={{
            onSuccess
          }}
        />
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
          type='button'
          label='Create / Clone'
          title='Store this item, then create a new copy'
          onClick={() => {
            clone = true
          }}
          transform={transformProtectionValues}
          mutationOptions={{
            onSuccess
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
            onSuccess
          }}
        />
      </FlexBox>
    </Toolbar>
  )
}

export default ItemFormToolbar
