import React from 'react'

const OrganisationList = React.lazy(
  async () => await import('./OrganisationList')
)
const OrganisationShow = React.lazy(
  async () => await import('./OrganisationShow')
)

const organisations = {
  list: OrganisationList,
  show: OrganisationShow
}

export default organisations
