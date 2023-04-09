import { useEffect, useState, type ReactElement } from 'react'
import {
  type ReferenceInputProps,
  useDataProvider,
  SelectInput
} from 'react-admin'
import * as constants from '../constants'

interface Props {
  child: ReferenceInputProps
}

interface Data {
  id: number
  [key: string]: any
}

export default function SourceNestedFilterInput(
  props: Props & ReferenceInputProps
): ReactElement {
  const { label, child } = props
  const [children, setChildren] = useState<Data[]>([])
  const [sources, setSources] = useState<Data[]>([])
  const dataProvider = useDataProvider()

  const getData = async (resource: string): Promise<Data[]> => {
    const { data } = await dataProvider.getList<Data>(resource, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    return data
  }

  useEffect(() => {
    ;(() => {
      getData(child.reference)
        .then((res) => {
          setChildren(res)
        })
        .catch(console.log)
      getData(constants.R_BATCHES)
        .then((res) => {
          setSources(res)
        })
        .catch(console.log)
    })()
  }, [])

  const options = children.map((child: Data) => {
    const val: Data = {
      id: child.id,
      name: child.name,
      batchId: sources
        .filter((src) => src.project === child.id)
        .map((item) => item.id)
    }
    return val
  })

  return (
    <>
      <SelectInput
        key={label}
        label={label}
        source={'batchId'}
        optionValue={'batchId'}
        choices={options}
      />
    </>
  )
}
