import React from 'react'

const VaultLocationList = React.lazy(
  async () => await import('./VaultLocationList')
)
const VaultLocationShow = React.lazy(
  async () => await import('./VaultLocationShow')
)

const vaultLocations = {
  list: VaultLocationList,
  show: VaultLocationShow
}

export default vaultLocations
