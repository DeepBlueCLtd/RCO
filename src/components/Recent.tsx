import { Box, type Theme, Typography } from '@mui/material'
import React from 'react'
import { Datagrid, List, ResourceContext, TextField } from 'react-admin'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import SourceField from './SourceField'

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.common.black
  },
  cardContent: {
    padding: '10px 0 0',
    minWidth: '294px',
    minHeight: '260px',
    '&:last-child': {
      paddingBottom: 0
    }
  },
  container: {
    '& .MuiPaper-root': {
      boxShadow: 'unset !important'
    },
    '& tr:last-child td': {
      borderBottom: 0
    }
  }
}))

interface Field<T> {
  source: keyof T
  reference?: string
}

interface Props<T> {
  resource: string
  itemsCount?: number
  label?: string
  fields: Array<Field<T>>
}

function Column<T>(props: Field<T>) {
  const { source, reference } = props
  if (typeof reference !== 'undefined') {
    return (
      <SourceField
        link={false}
        source={source as string}
        reference={reference}
      />
    )
  }
  return <TextField source={source as string} />
}

interface RecentCardProps {
  children: React.ReactElement
  label?: string
  resource?: string
}

export function RecentCard(props: RecentCardProps) {
  const { label, resource = '', children } = props
  const classes = useStyles()
  return (
    <Box>
      <Card variant='outlined'>
        <CardContent className={classes.cardContent}>
          <Typography variant='h6'>
            {typeof label !== 'undefined' && (
              <Link to={resource} className={classes.label}>
                {label}
              </Link>
            )}
          </Typography>
          <Box sx={{ mt: 2 }} className={classes.container}>
            {children}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
export default function Recent<T>(props: Props<T>): React.ReactElement {
  const { resource, itemsCount = 5, label, fields = [] } = props

  return (
    <RecentCard label={label} resource={resource}>
      <ResourceContext.Provider value={resource}>
        <List
          hasCreate={false}
          actions={false}
          perPage={itemsCount}
          pagination={false}
          sort={{ field: 'id', order: 'DESC' }}>
          <Datagrid
            header={() => null}
            bulkActionButtons={false}
            rowClick='show'>
            {fields.map((column, index) => (
              <Column key={index} {...column} />
            ))}
          </Datagrid>
        </List>
      </ResourceContext.Provider>
    </RecentCard>
  )
}
