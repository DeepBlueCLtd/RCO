import React from 'react'
import { Create, Edit } from 'react-admin'
import ProjectForm from './ProjectForm'

const ProjectList = React.lazy(async () => await import('./ProjectList'))
const ProjectShow = React.lazy(async () => await import('./ProjectShow'))

const ProjectCreate = (): React.ReactElement => {
  return (
    <Create>
      <ProjectForm />
    </Create>
  )
}

const ProjectEdit = (): React.ReactElement => {
  return (
    <Edit>
      <ProjectForm isEdit />
    </Edit>
  )
}

const projects = {
  create: ProjectCreate,
  edit: ProjectEdit,
  list: ProjectList,
  show: ProjectShow
}

export default projects
