import { Box, type Theme, Typography, type SxProps } from '@mui/material'
import React from 'react'
import {
  Datagrid,
  type FilterPayload,
  List,
  ResourceContext,
  TextField,
  type DatagridProps
} from 'react-admin'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { ICON_BATCH, R_BATCHES } from '../constants'
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
  label?: string
  sortable?: boolean
}

interface Props<T> extends DatagridProps {
  resource: string
  itemsCount?: number
  label?: string
  fields: Array<Field<T>>
  filter?: FilterPayload
  search?: string
  rowStyle?: (data: T) => SxProps
  isTitleClickable?: boolean
}

function Column<T extends Batch | Dispatch | LoanUser>(
  props: Field<T>
): React.ReactElement {
  const { source, reference, component, label = '', sortable } = props
  if (typeof component !== 'undefined') {
    return React.createElement(component, { source })
  }
  if (typeof reference !== 'undefined') {
    return (
      <SourceField<T>
        link={false}
        source={source}
        reference={reference}
        label={label}
        textProps={{ sortable }}
      />
    )
  }
  return <TextField source={source as string} sortable={sortable} />
}

interface RecentCardProps extends DatagridProps {
  children: React.ReactElement
  label?: string
  resource?: string
  search?: string
  isTitleClickable?: boolean
}

export function RecentCard(props: RecentCardProps): React.ReactElement {
  const { label, resource = '', children, search, isTitleClickable } = props
  const classes = useStyles()
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
              {typeof label !== 'undefined' &&
                (isTitleClickable !== false ? (
                  <Link
                    to={{
                      pathname: resource,
                      ...(search !== undefined ? { search } : null)
                    }}
                    className={classes.label}>
                    {label}
                  </Link>
                ) : (
                  <div className={classes.label}>{label}</div>
                ))}
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
export default function Recent<T extends Batch | Dispatch | LoanUser>(
  props: Props<T>
): React.ReactElement {
  const {
    resource,
    itemsCount = 10,
    label,
    fields = [],
    filter,
    search,
    rowStyle,
    rowClick,
    isTitleClickable
  } = props

  return (
    <RecentCard
      label={label}
      resource={resource}
      search={search}
      isTitleClickable={isTitleClickable}>
      <ResourceContext.Provider value={resource}>
        <List
          filter={filter}
          storeKey={`recent-${resource}`}
          hasCreate={false}
          actions={false}
          perPage={itemsCount}
          pagination={false}
          sort={{ field: 'id', order: 'DESC' }}
          empty={<></>}>
          <Datagrid
            rowStyle={rowStyle}
            /* include headers header={() => null} */
            bulkActionButtons={false}
            rowClick={rowClick ?? 'show'}>
            {fields.map((column, index) => (
              <Column<T> key={index} {...column} sortable={false} />
            ))}
          </Datagrid>
        </List>
      </ResourceContext.Provider>
    </RecentCard>
  )
}
