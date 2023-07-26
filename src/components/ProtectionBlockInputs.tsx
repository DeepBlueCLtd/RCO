import FlexBox from './FlexBox'
import * as constants from '../constants'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import SourceInput from './SourceInput'
import ProtectionRefInput from './ProtectionRefInput'
import { useDataProvider, type RaRecord } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useConfigData } from '../utils/useConfigData'
import { useEffect, useState } from 'react'
import useAudit from '../hooks/useAudit'
import { useParams } from 'react-router-dom'
import { AuditType } from '../utils/activity-types'
interface Props {
  disabled?: boolean
  markingSource: string
  isEdit?: boolean
  id?: number
  resource: string
  refTables: Record<'catCave' | 'catCode' | 'catHandle', string>
}

export default function ProtectionBlockInputs<
  TCatCode extends RaRecord,
  TCatCave extends RaRecord,
  TCatHandle extends RaRecord
>(props: Props): React.ReactElement {
  const { disabled, markingSource, isEdit, id, refTables } = props
  const { setValue, watch, getValues } = useFormContext()
  const dataProvider = useDataProvider()
  const configData = useConfigData()
  const { id: dataId } = useParams()
  const audit = useAudit()
  const {
    formState: { isSubmitSuccessful }
  } = useFormContext()
  const [codeChanges, setCodeChanges] = useState<string[]>()
  const [caveChanges, setCaveChanges] = useState<string[]>()
  const [handleChanges, setHandleChanges] = useState<string[]>()
  const [submitted, setSubmitted] = useState(false)
  const inputProps = { disabled }

  const protectionInputProps = {
    ...inputProps,
    multiple: true
  }

  const setIsDirty = (source: string, value = ''): void => {
    setValue(source, value, {
      shouldDirty: true
    })
  }

  const setProtectiveMarking = (id: number): void => {
    if (!id) return
    dataProvider
      .getOne(constants.R_PROTECTIVE_MARKING, { id })
      .then(({ data: pMarking }) => {
        setValue('pMarking', pMarking.name)
      })
      .catch(console.error)
  }

  useEffect(() => {
    const subscription = watch((data, { name }): void => {
      if (name === 'protectiveMarking') {
        setProtectiveMarking(data.protectiveMarking)
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [watch])

  useEffect(() => {
    setProtectiveMarking(getValues('protectiveMarking'))
  }, [])

  useEffect(() => {
    if (isSubmitSuccessful) {
      setSubmitted(true)
    }
    const isChanged =
      typeof codeChanges !== 'undefined' ||
      typeof caveChanges !== 'undefined' ||
      typeof handleChanges !== 'undefined'
    if ((isSubmitSuccessful || submitted) && dataId && isChanged) {
      const detailData: Record<string, string> = {
        catCode: codeChanges?.join(' ') ?? '',
        catCave: caveChanges?.join(' ') ?? '',
        catHandle: handleChanges?.join(' ') ?? ''
      }
      const activityDetail = `Previous values: ${JSON.stringify(detailData)}`
      if (dataId) {
        audit({
          activityDetail,
          resource: props.resource,
          securityRelated: true,
          dataId: parseInt(dataId),
          type: AuditType.EDIT
        })
          .then(console.log)
          .catch(console.error)
      }
    }
  }, [isSubmitSuccessful, codeChanges, submitted])

  return (
    <Box
      component='fieldset'
      style={{
        width: '100%',
        padding: '0 15px',
        borderRadius: 16,
        margin: '20px 0'
      }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          {configData?.protectionName}
        </Typography>
      </legend>
      <FlexBox alignItems={'start'}>
        <ProtectionRefInput<CatCode, TCatCode>
          setIsDirty={setIsDirty}
          reference={constants.R_CAT_CODE}
          refTable={refTables.catCode}
          labelField='name'
          source='catCode'
          itemId={id}
          label={configData?.catCode ?? 'Cat code'}
          {...protectionInputProps}
          width='20%'
          onValueChange={setCodeChanges}
        />
        <SourceInput
          source={markingSource}
          filter={isEdit === true ? {} : { active: true }}
          reference={constants.R_PROTECTIVE_MARKING}
          inputProps={{ ...inputProps, sx: { width: '20%' } }}
        />
        <ProtectionRefInput<CatHandle, TCatHandle>
          setIsDirty={setIsDirty}
          reference={constants.R_CAT_HANDLE}
          refTable={refTables.catHandle}
          source='catHandle'
          itemId={id}
          label={configData?.catHandle ?? 'Cat handle'}
          labelField='name'
          {...protectionInputProps}
          width='30%'
          onValueChange={setHandleChanges}
        />
        <ProtectionRefInput<CatCave, TCatCave>
          setIsDirty={setIsDirty}
          reference={constants.R_CAT_CAVE}
          refTable={refTables.catCave}
          source='catCave'
          labelField='name'
          itemId={id}
          label={configData?.catCave ?? 'Cat cave'}
          {...protectionInputProps}
          width='30%'
          onValueChange={setCaveChanges}
        />
      </FlexBox>
    </Box>
  )
}
