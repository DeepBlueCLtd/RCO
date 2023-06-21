import { SaveButton, Toolbar, useNotify } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import FlexBox from '../../../components/FlexBox'
import mitt from 'mitt'
import { useEffect } from 'react'
import { SAVE_EVENT } from '../../../constants'

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
  const notify = useNotify()
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

  const transformResource = (
    data: Record<string, any>
  ): Record<string, any> => {
    const { catCave, catCode, catHandling, ...rest } = data
    return rest
  }

  if (typeof id !== 'undefined') {
    return (
      <Toolbar>
        <SaveButton
          label='Save'
          type='button'
          transform={transformResource}
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
      } item.`
    )
  }

  return (
    <Toolbar>
      <FlexBox>
        <SaveButton
          type='button'
          label='Save and clone'
          onClick={() => {
            clone = true
          }}
          transform={transformResource}
          mutationOptions={{
            onSuccess
          }}
        />
        <SaveButton
          type='button'
          label='Save and Create'
          onClick={() => {
            save = true
          }}
          transform={transformResource}
          mutationOptions={{
            onSuccess
          }}
        />
      </FlexBox>
    </Toolbar>
  )
}

export default ItemFormToolbar
