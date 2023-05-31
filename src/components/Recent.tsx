import { Box, type Theme, Typography } from '@mui/material'
import React from 'react'
import {
  Datagrid,
  type FilterPayload,
  List,
  ResourceContext,
  TextField,
  useGetList
} from 'react-admin'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { ICON_BATCH, R_BATCHES, R_ITEMS } from '../constants'
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
    minWidth: '342px',
    minHeight: '260px',
    '&:last-child': {
      paddingBottom: 0
    }
  },
  container: {
    '& .MuiPaper-root': {
      boxShadow: 'unset !important'
    },
    '& tr td': {
      whiteSpace: 'nowrap'
    },
    '& tr:last-child td': {
      borderBottom: 0
    }
  }
}))

interface Field<T> {
  source: keyof T
  reference?: string
  component?: React.FC<any>
}

interface Props<T> {
  resource: string
  itemsCount?: number
  label?: string
  fields: Array<Field<T>>
  filter?: FilterPayload
  onFilter?: boolean
  queryFilter?: FilterPayload
}

function Column<T>(props: Field<T>): React.ReactElement {
  const { source, reference, component } = props
  if (typeof component !== 'undefined') {
    return React.createElement(component, { source })
  }

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
  onFilter?: boolean
  queryFilter?: FilterPayload
}

export function RecentCard(props: RecentCardProps): React.ReactElement {
  const { label, resource = '', onFilter, children, queryFilter } = props
  const classes = useStyles()

  const { data } = useGetList<Item>(R_ITEMS, {
    sort: { field: 'id', order: 'ASC' }
  })
  const loaned = data?.filter((d) => d.loanedTo !== undefined).map((f) => f.id)

  return (
    <Box>
      <Card variant='outlined'>
        <CardContent className={classes.cardContent}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              justifyContent: 'center'
            }}>
            {resource === R_BATCHES ? <ICON_BATCH /> : ''}
            <Typography variant='h6'>
              {typeof label !== 'undefined' && (
                <Link
                  to={{
                    pathname: resource,
                    search:
                      onFilter !== false
                        ? `filter=${JSON.stringify(
                            queryFilter ?? { id: loaned }
                          )}`
                        : ''
                  }}
                  className={classes.label}>
                  {label}
                </Link>
              )}
            </Typography>
          </div>
          <Box sx={{ mt: 2 }} className={classes.container}>
            {children}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
export default function Recent<T>(props: Props<T>): React.ReactElement {
  const {
    resource,
    itemsCount = 5,
    label,
    fields = [],
    filter,
    onFilter,
    queryFilter
  } = props

  return (
    <RecentCard
      queryFilter={queryFilter}
      label={label}
      resource={resource}
      onFilter={onFilter}>
      <ResourceContext.Provider value={resource}>
        <List
          filter={filter}
          storeKey={`recent-${resource}`}
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
