import React from 'react'
import { Create, Edit, ShowButton, TopToolbar } from 'react-admin'
import BatchNumber from '../../components/BatchNumber'
import ItemForm from './ItemForm'
import * as constants from '../../constants'

const ItemList = React.lazy(async () => await import('./ItemList'))
const ItemShow = React.lazy(async () => await import('./ItemShow'))

const ItemCreate = (): React.ReactElement => {
  return (
    <Create
      actions={
        <TopToolbar>
          <BatchNumber queryParams='batch' />
        </TopToolbar>
      }>
      <ItemForm />
    </Create>
  )
}

const ItemEdit = (): React.ReactElement => {
  return (
    <Edit
      actions={
        <TopToolbar>
          <BatchNumber
            resource={constants.R_ITEMS}
            reference={constants.R_BATCHES}
          />
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
