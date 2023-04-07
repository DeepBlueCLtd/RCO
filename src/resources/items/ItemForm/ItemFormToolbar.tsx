import { SaveButton, Toolbar, useNotify } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import FlexBox from '../../../components/FlexBox'

const ItemFormToolbar = () => {
  const { reset } = useFormContext()
  const notify = useNotify()
  const { id } = useParams()

  if (typeof id !== 'undefined') {
    return (
      <Toolbar>
        <SaveButton label='Save' />
      </Toolbar>
    )
  }

  return (
    <Toolbar>
      <FlexBox>
        <SaveButton
          type='button'
          label='Save and clone'
          mutationOptions={{
            onSuccess: () => {
              notify('Element created and cloned')
            }
          }}
        />
        <SaveButton
          type='button'
          label='Save'
          mutationOptions={{
            onSuccess: () => {
              reset()
              notify('Element created')
            }
          }}
        />
      </FlexBox>
    </Toolbar>
  )
}

export default ItemFormToolbar
