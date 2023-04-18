import React from 'react'
import { Create, Edit, ShowButton, TopToolbar } from 'react-admin'
import ItemForm from './ItemForm'
import TopToolbarField from '../../components/TopToolbarField'

const ItemList = React.lazy(async () => await import('./ItemList'))
const ItemShow = React.lazy(async () => await import('./ItemShow'))

const ItemCreate = (): React.ReactElement => {
  return (
    <Create>
      <ItemForm />
    </Create>
  )
}

const ItemEdit = (): React.ReactElement => {
  return (
    <Edit
      actions={
        <TopToolbar>
          <TopToolbarField source='item_number' />
          <ShowButton />
        </TopToolbar>
      }>
      <ItemForm />
    </Edit>
  )
}

const items = {
  create: ItemCreate,
  edit: ItemEdit,
  list: ItemList,
  show: ItemShow
}

export default items
