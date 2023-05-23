import { SaveButton, Toolbar, useNotify } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import FlexBox from '../../../components/FlexBox'
import mitt from 'mitt'
import { useEffect } from 'react'

// eslint-disable-next-line
type Events = {
  save: string
}

let clone = false
let save = false
export const emitter = mitt<Events>()
const ItemFormToolbar = (): React.ReactElement => {
  const { reset } = useFormContext()
  const notify = useNotify()
  const { id } = useParams()

  const saveHandler = (e: string): void => {
    if (clone) {
      clone = false
      saveAndClone(e, 'clone')
    }
    if (save) {
      save = false
      saveAndClone(e, 'save')
      reset()
    }
  }

  useEffect(() => {
    emitter.on('save', saveHandler)
    return () => {
      emitter.off('save', saveHandler)
    }
  }, [])

  if (typeof id !== 'undefined') {
    return (
      <Toolbar>
        <SaveButton label='Save' />
      </Toolbar>
    )
  }

  const saveAndClone = (itemNumber: string, type: string): void => {
    notify(
      `Item ${itemNumber} has been saved. Now showing ${
        type === 'clone' ? 'clone' : 'blank'
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
          mutationOptions={{
            onSuccess: () => {}
          }}
        />
        <SaveButton
          type='button'
          label='Save and Create'
          onClick={() => {
            save = true
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
