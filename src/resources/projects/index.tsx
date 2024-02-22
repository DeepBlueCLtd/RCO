import React from 'react'
import { Create, Edit, useRedirect } from 'react-admin'
import ProjectForm from './ProjectForm'
import * as constants from '../../constants'

const ProjectList = React.lazy(async () => await import('./ProjectList'))
const ProjectShow = React.lazy(async () => await import('./ProjectShow'))

const ProjectCreate = (): React.ReactElement => {
  const redirect = useRedirect()
  return (
    <Create
      mutationOptions={{
        onSuccess: (data: { projectNumber: string; id: number }): void => {
          redirect(`/${constants.R_PROJECTS}/${data?.id}/show`)
        }
      }}>
      <ProjectForm />
    </Create>
  )
}

const ProjectEdit = (): React.ReactElement => {
  const redirect = useRedirect()
  return (
    <Edit
      mutationMode={constants.MUTATION_MODE}
      mutationOptions={{
        onSuccess: (data: { projectNumber: string; id: number }): void => {
          redirect(`/${constants.R_PROJECTS}/${data?.id}/show`)
        }
      }}>
      <ProjectForm isEdit />
    </Edit>
  )
}

const projects: ResourceRoutes = {
  create: ProjectCreate,
  edit: ProjectEdit,
  list: ProjectList,
  show: ProjectShow
}

export default projects
