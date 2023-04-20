import { Box, type Theme, Typography } from '@mui/material'
import React from 'react'
import { Datagrid, List, ResourceContext, TextField } from 'react-admin'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableRow
} from '@mui/material'
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
  list: {
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
  resource?: string
  itemsCount?: number
  label?: string
  fields: Array<Field<T>>
  defaultData?: Array<Data<T>>
}

type Data<T> = {
  [key in keyof T]: any
} & {
  id: number
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

export default function Recent<T>(props: Props<T>): React.ReactElement {
  const classes = useStyles()
  const {
    resource,
    itemsCount = 5,
    label,
    fields = [],
    defaultData = []
  } = props

  const data: Array<Data<T>> = defaultData

  return (
    <Box>
      <Card variant='outlined'>
        <CardContent className={classes.cardContent}>
          <Typography variant='h6'>
            {typeof label !== 'undefined' && (
              <Link to={resource ?? ''} className={classes.label}>
                {label}
              </Link>
            )}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {typeof resource !== 'undefined' ? (
              <ResourceContext.Provider value={resource}>
                <List
                  hasCreate={false}
                  actions={false}
                  perPage={itemsCount}
                  pagination={false}
                  className={classes.list}
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
            ) : (
              <PlaceholderTable data={data} fields={fields} />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

interface PlaceholderTableProps<T> {
  data: Array<Data<T>>
  fields: Array<Field<T>>
}

function PlaceholderTable<T>(props: PlaceholderTableProps<T>) {
  const { data, fields } = props
  const classes = useStyles()
  return (
    <TableContainer>
      <Table className={classes.list}>
        <TableBody>
          {data.map((item) => (
            <TableRow hover key={item.id}>
              {fields.map((column) => {
                const value = item[column.source]
                return (
                  <TableCell key={value} sx={{ padding: '6px 16px' }}>
                    {value}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
