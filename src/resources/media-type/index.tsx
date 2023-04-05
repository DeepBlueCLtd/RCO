import React from 'react'

const MediaTypeList = React.lazy(async () => await import('./MediaTypeList'))
const MediaTypeShow = React.lazy(async () => await import('./MediaTypeShow'))

const mediaTypes = {
  list: MediaTypeList,
  show: MediaTypeShow
}

export default mediaTypes
