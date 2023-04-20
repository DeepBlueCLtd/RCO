import {
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableRow
} from '@mui/material'
import { RecentCard } from './Recent'

type Data<T> = {
  [key in keyof T]: any
} & {
  id: number
}

interface Props<T> {
  label: string
  data: Array<Data<T>>
  fields: Array<keyof Data<T>>
}

function RecentMock<T>(props: Props<T>) {
  const { data, fields, label } = props

  return (
    <RecentCard label={label}>
      <TableContainer>
        <Table>
          <TableBody>
            {data.map((item) => (
              <TableRow hover key={item.id}>
                {fields.map((column) => {
                  const value = item[column]
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
    </RecentCard>
  )
}

export default RecentMock
