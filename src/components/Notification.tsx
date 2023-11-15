import React from 'react'
import { Notification } from 'react-admin'

const CustomNotification = (): React.ReactElement => (
  <Notification
    autoHideDuration={10 * 1000}
    ClickAwayListenerProps={{ onClickAway: () => null }}
  />
)

export default CustomNotification
