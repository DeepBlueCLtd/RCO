import { List, type ListProps } from 'react-admin'
import useLocalStore from '../hooks/useLocalStore'

export interface ListWithLocalStoreProps extends ListProps {
  resource: string
  storeKey: string
}

interface ListChildProps {
  storeKey: string
  resource: string
}

export const ListLocalStore = (props: ListChildProps): React.ReactElement => {
  const { storeKey, resource } = props
  useLocalStore(storeKey, resource)
  return <></>
}

export default function ListWithLocalStore(
  props: ListWithLocalStoreProps
): React.ReactElement {
  const { children, storeKey, resource } = props
  return (
    <List {...props}>
      <ListLocalStore storeKey={storeKey} resource={resource} />
      {children}
    </List>
  )
}
