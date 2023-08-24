import { List, type ListProps } from 'react-admin'
import useLocalStore from '../hooks/useLocalStore'
interface ListChildProps {
  storeKey: string | false
  resource: string
}

export const ListChildStore = (props: ListChildProps): React.ReactElement => {
  const { storeKey, resource } = props
  useLocalStore(storeKey as string, resource)
  return <></>
}

export default function ListWithLocalStore(
  props: RequiredBy<ListProps, 'storeKey' | 'resource'>
): React.ReactElement {
  const { children, storeKey, resource } = props
  return (
    <List {...props}>
      <ListChildStore storeKey={storeKey} resource={resource} />
      {children}
    </List>
  )
}
