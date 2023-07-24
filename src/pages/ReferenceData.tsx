import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  type Theme,
  Typography
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import { type CreatePathParams, useCreatePath, useRedirect } from 'react-admin'
import { useConfigData } from '../utils/useConfigData'

interface CardWithNavigationProps {
  title: string
  path: CreatePathParams['resource']
  type?: CreatePathParams['type']
  isRarelyUsed?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '&.active': {
      background: theme.palette.primary.light,
      color: theme.palette.common.white,
      '& p': {
        fill: theme.palette.common.white
      }
    }
  },
  content: {
    height: '150px',
    width: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  common: {
    height: '50px',
    width: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
}))

const CardWithNavigation = (
  props: CardWithNavigationProps
): React.ReactElement => {
  const { path, title, type = 'list' } = props
  const createPath = useCreatePath()
  const styles = useStyles()
  const redirect = useRedirect()
  const pathStr: string = path
  const to = createPath({ resource: `${pathStr}`, type })
  const rootStyle: string = styles.root
  return (
    <Card
      onClick={() => {
        redirect(to)
      }}
      className={`${rootStyle}`}>
      <CardActionArea>
        <CardContent
          className={
            props.isRarelyUsed === true ? styles.common : styles.content
          }>
          <Typography>{title}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default function ReferenceData(): React.ReactElement {
  const configData = useConfigData()

  const mainReferenceRoutes = [
    { path: '/platform', title: 'Platforms' },
    { path: '/audit', title: 'Audit Log' },
    { path: '/vault', title: 'Vault' }
  ]

  const rarelyUsedRoutes = [
    { path: '/organisation', title: 'Organisation' },
    { path: '/protectiveMarking', title: 'Protective Marking' },
    { path: '/catCode', title: configData?.catCode ?? 'Cat Code' },
    { path: '/catHandle', title: configData?.catHandle ?? 'Cat Handle' },
    { path: '/catCave', title: configData?.catCave ?? 'Cat Cave' },
    { path: '/mediaType', title: 'Media Type' },
    { path: '/department', title: 'Department' },
    { path: '/address', title: 'Addresses' }
  ]
  return (
    <div>
      <h1></h1>
      <Box display='flex' flexWrap='wrap' gap='20px' padding='20px'>
        {mainReferenceRoutes.map((route) => (
          <CardWithNavigation key={route.title} {...route} />
        ))}
      </Box>

      <Box display='flex' flexWrap='wrap' gap='20px' padding='20px'>
        {rarelyUsedRoutes.map((route) => (
          <CardWithNavigation isRarelyUsed key={route.title} {...route} />
        ))}
      </Box>
    </div>
  )
}
