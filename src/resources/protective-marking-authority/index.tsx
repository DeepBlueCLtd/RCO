import React from 'react'

const ProtectiveMarkingAuthorityList = React.lazy(
  async () => await import('./ProtectiveMarkingAuthorityList')
)
const ProtectiveMarkingAuthorityShow = React.lazy(
  async () => await import('./ProtectiveMarkingAuthorityShow')
)

const protectiveMarkingAuthorities = {
  list: ProtectiveMarkingAuthorityList,
  show: ProtectiveMarkingAuthorityShow
}

export default protectiveMarkingAuthorities
