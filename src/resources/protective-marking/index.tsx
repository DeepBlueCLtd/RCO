import React from 'react'

const ProtectiveMarkingList = React.lazy(
  async () => await import('./ProtectiveMarkingList')
)
const ProtectiveMarkingShow = React.lazy(
  async () => await import('./ProtectiveMarkingShow')
)

const protectivemarkings = {
  list: ProtectiveMarkingList,
  show: ProtectiveMarkingShow
}

export default protectivemarkings
