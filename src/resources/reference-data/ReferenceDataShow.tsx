import { Card, CardContent, Typography } from '@mui/material'
import {
  BooleanField,
  EditButton,
  Show,
  TextField,
  TopToolbar,
  useRedirect,
  useShowContext
} from 'react-admin'
import { ValueField } from '../projects/ProjectShow'
import { R_MEDIA_TYPE, type ResourceTypes } from '../../constants'
import useCanAccess from '../../hooks/useCanAccess'
import HistoryButton from '../../components/HistoryButton'
import { getResourceName } from '.'

interface ShowActionProps {
  resource: ResourceTypes
}

const Actions = ({ resource }: ShowActionProps): React.ReactElement => {
  const { hasAccess } = useCanAccess()
  const { record } = useShowContext()
  const redirect = useRedirect()
  return (
    <TopToolbar sx={{ alignItems: 'center' }}>
      <EditButton />
      <HistoryButton
        onClick={() => {
          redirect(
            `/audit?filter=${JSON.stringify({ dataId: record.id, resource })}`
          )
        }}
      />
      {hasAccess(resource, { write: true }) ? <EditButton /> : null}
    </TopToolbar>
  )
}

interface PropType {
  name: string
}

export default function ReferenceDataShow({
  name
}: PropType): React.ReactElement {
  const cName: ResourceTypes = name as ResourceTypes
  const resourceName = getResourceName(name)
  return (
    <Show resource={name} actions={<Actions resource={cName} />}>
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '15px' }}>
        {`View ${resourceName}`}
      </Typography>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <ValueField label='Id'>
            <TextField<VaultLocation> variant='h6' source='id' />
          </ValueField>
          <ValueField label='name'>
            <TextField<VaultLocation> variant='h6' source='name' />
          </ValueField>
          {name === R_MEDIA_TYPE ? (
            <Typography>
              <ValueField label='Item size' sx={{ visibility: 'show' }}>
                <TextField variant='h6' source='itemSize' />
                &nbsp;
                <span style={{ fontWeight: 'bold' }}>(Note: </span> Item-size is
                stored to facilitate future shelf loading calculations)
              </ValueField>
            </Typography>
          ) : null}
          <ValueField label='active'>
            <BooleanField<VaultLocation> source='active' looseValue />
          </ValueField>
        </CardContent>
      </Card>
    </Show>
  )
}
