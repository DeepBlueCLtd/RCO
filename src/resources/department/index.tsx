import React from 'react'

const DepartmentList = React.lazy(async () => await import('./DepartmentList'))
const DepartmentShow = React.lazy(async () => await import('./DepartmentShow'))

const departments = {
  list: DepartmentList,
  show: DepartmentShow
}

export default departments
