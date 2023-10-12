import React from 'react'
import { Create, Edit, ShowButton, TopToolbar } from 'react-admin'
import ItemForm from './ItemForm'
import TopToolbarField from '../../components/TopToolbarField'
import { R_ITEMS, R_RICH_ITEMS } from '../../constants'

const ItemList = React.lazy(async () => await import('./ItemList'))
const ItemShow = React.lazy(async () => await import('./ItemShow'))

const ItemCreate = (): React.ReactElement => {
  return (
    <Create resource={R_ITEMS}>
      <ItemForm />
    </Create>
  )
}

const ItemEdit = (): React.ReactElement => {
  return (
    <Edit
      resource={R_ITEMS}
      actions={
        <TopToolbar>
          <TopToolbarField<Item> source='itemNumber' />
          <ShowButton resource={R_RICH_ITEMS} />
        </TopToolbar>
      }
      mutationMode='pessimistic'>
      <ItemForm isEdit />
    </Edit>
  )
}

const items: ResourceRoutes = {
  create: ItemCreate,
  edit: ItemEdit,
  list: ItemList,
  show: ItemShow
}

export default items
