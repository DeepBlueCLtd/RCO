import { type DataProvider } from 'react-admin'
import { R_DEPARTMENT, type ResourceTypes } from '../../../constants'
import { generateDepartmentForTesting } from './dummy-data'
import { common } from './common'

describe('Reference item tests', () => {})

const referenceItemTests = (
  provider: DataProvider,
  resource: ResourceTypes,
  dummyDataGenerate: typeof generateDepartmentForTesting
): Array<() => Promise<void>> => {
  const {
    checkEmptyAuditList,
    checkAuditListForFirstEntry,
    checkAuditListForSecondEntry
  } = common(provider, R_DEPARTMENT)

  return [
    async () => {
      await checkEmptyAuditList(provider)
      const createdDepartment = (
        await provider.create<ActiveReferenceItem>(resource, {
          data: dummyDataGenerate()
        })
      ).data

      await checkAuditListForFirstEntry(createdDepartment)
    },
    async () => {
      await checkEmptyAuditList(provider)
      const createdDepartment = (
        await provider.create<ActiveReferenceItem>(resource, {
          data: generateDepartmentForTesting()
        })
      ).data
      await checkAuditListForFirstEntry(createdDepartment)

      await provider.update<ActiveReferenceItem>(resource, {
        id: createdDepartment.id,
        previousData: createdDepartment,
        data: {
          id: createdDepartment.id,
          name: 'dummy-department-1',
          active: false
        }
      })
      await checkAuditListForSecondEntry(createdDepartment)
    }
  ]
}

export default referenceItemTests