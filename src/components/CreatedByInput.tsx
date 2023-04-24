import React, { useEffect } from 'react'
import { type Identifier, useGetIdentity, useNotify } from 'react-admin'
import { useFormContext } from 'react-hook-form'

interface Props {
  source?: string
}

export default function CreatedByInput(props: Props): React.ReactElement {
  const { source = 'createdBy' } = props
  const { data } = useGetIdentity()
  const notify = useNotify()
  const formContext = useFormContext()

  useEffect(() => {
    if (formContext !== null) {
      const { setValue, getValues } = formContext

      const values = getValues()
      const createdByValue = values[source]
      const createdBy: Identifier | undefined = data?.id
      if (createdBy === undefined) {
        notify('User not found!', { type: 'error' })
        return
      }
      if (createdByValue !== undefined) return

      setValue(source, createdBy)
    }
  }, [data, formContext])

  return <></>
}
