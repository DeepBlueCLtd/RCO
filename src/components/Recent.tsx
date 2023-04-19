import { Box, type Theme, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDataProvider } from 'react-admin'
import { makeStyles } from '@mui/styles'
import FlexBox from './FlexBox'
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.common.black
  }
}))

interface Props<T> {
  resource?: string
  itemsCount?: number
  label?: string
  fields: Array<keyof T>
  defaultData?: Array<Data<T>>
}

type Data<T> = {
  [key in keyof T]: any
} & {
  id: number
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

  const dataProvider = useDataProvider()
  const [data, setData] = useState<Array<Data<T>>>(defaultData)

  const getData = () => {
    if (typeof resource !== 'undefined') {
      dataProvider
        .getList<Data<T>>(resource, {
          sort: { field: 'id', order: 'DESC' },
          pagination: { page: 1, perPage: itemsCount },
          filter: {}
        })
        .then(({ data }) => {
          setData(data)
        })
        .catch(console.log)
    }
  }

  useEffect(() => {
    if (data.length === 0) {
      getData()
    }
  }, [])

  return (
    <Box>
      <Card sx={{ minWidth: 300, minHeight: 206 }} variant='outlined'>
        <CardContent>
          <Typography variant='h6'>
            {typeof label !== 'undefined' && (
              <Link to={resource ?? ''} className={classes.label}>
                {label}
              </Link>
            )}
          </Typography>
          <Box sx={{ mb: 1.5 }}>
            {data.map((item) => (
              <Row data={item} fields={fields} key={item.id} />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

interface RowProps<T> {
  fields: Array<keyof T>
  data: T
}

function Row<T>(props: RowProps<T>): React.ReactElement {
  const { fields, data } = props

  return (
    <FlexBox>
      {fields.map((field) => {
        const value = data[field] as string | number

        return <Typography key={value}>{value}</Typography>
      })}
    </FlexBox>
  )
}
