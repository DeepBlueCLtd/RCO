import { type DataProvider } from 'react-admin'
import { type ResourceTypes } from '../../../constants'
import { generateActiveReferenceItemForTesting } from './dummy-data'
import { common } from './common'

describe('Reference item tests', () => {})

const referenceItemTests = (
  provider: DataProvider,
  resource: ResourceTypes,
  dummyDataGenerate: typeof generateActiveReferenceItemForTesting
): Array<() => Promise<void>> => {
  const {
    checkEmptyAuditList,
    checkAuditListForFirstEntry,
    checkAuditListForSecondEntry
  } = common(provider, resource)

  return [
    async () => {
      await checkEmptyAuditList(provider)
      const createdActiveReferenceItem = (
        await provider.create<ActiveReferenceItem>(resource, {
          data: dummyDataGenerate(`Dummy-${(resource as string).toUpperCase()}`)
        })
      ).data

      await checkAuditListForFirstEntry(createdActiveReferenceItem)
    },
    async () => {
      await checkEmptyAuditList(provider)
      const createdActiveReferenceItem = (
        await provider.create<ActiveReferenceItem>(resource, {
          data: generateActiveReferenceItemForTesting(
            `Dummy-${(resource as string).toUpperCase()}`
          )
        })
      ).data
      await checkAuditListForFirstEntry(createdActiveReferenceItem)

      await provider.update<ActiveReferenceItem>(resource, {
        id: createdActiveReferenceItem.id,
        previousData: createdActiveReferenceItem,
        data: {
          id: createdActiveReferenceItem.id,
          name: `dummy-${(resource as string).toLowerCase()}`,
          active: false
        }
      })
      await checkAuditListForSecondEntry(createdActiveReferenceItem)
    }
  ]
}

export default referenceItemTests
