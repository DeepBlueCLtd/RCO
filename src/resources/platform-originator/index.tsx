import React from 'react'

const PlatformOriginatorList = React.lazy(
  async () => await import('./PlatformOriginatorList')
)
const PlatformOriginatorShow = React.lazy(
  async () => await import('./PlatformOriginatorShow')
)

const platformOriginators = {
  list: PlatformOriginatorList,
  show: PlatformOriginatorShow
}

export default platformOriginators
