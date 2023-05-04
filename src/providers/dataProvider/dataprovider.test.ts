import { type DataProvider } from 'react-admin'
import { getDataProvider } from '.'
import {
  R_BATCHES
  //   R_ITEMS,
  //   R_PLATFORMS,
  //   R_PROJECTS,
  //   R_USERS
} from '../../constants'
import { DateTime } from 'luxon'

const year: number = 2023

const generateDummyBatchForTesting = (name?: string): Omit<Batch, 'id'> => {
  return {
    name: name ?? 'Dummy-Batch',
    startDate: DateTime.now().toFormat('yyyy-MM-dd'),
    endDate: DateTime.now().plus({ day: 1 }).toFormat('yyyy-MM-dd'),
    projectCode: '1',
    batchNumber: 'V01/2023',
    yearOfReceipt: String(year),
    department: 1,
    project: 1,
    platform: 1,
    organisation: 1,
    maximumProtectiveMarking: 1,
    remarks: 'remarks-1',
    receiptNotes: 'receipt-notes-1',
    createdAt: DateTime.now().toFormat('yyyy-MM-dd'),
    createdBy: 1
  }
}

// const generateDummyPlatformForTesting = (): Omit<Platform, 'id'> => {
//   return {
//     name: 'Dummy-Platform-1',
//     active: false
//   }
// }

// const generateDummyProjectForTesting = (): Omit<Project, 'id'> => {
//   return {
//     name: 'Dummy-Project-1',
//     remarks: 'remarks-1',
//     createdAt: DateTime.now().toFormat('yyyy-MM-dd'),
//     createdBy: 1
//   }
// }

// const generateDummyUserForTesting = (): Omit<User, 'id'> => {
//   return {
//     name: 'USER-1',
//     password: '1234',
//     adminRights: true
//   }
// }

// const generateDummyItemForTesting = (): Omit<Item, 'id'> => {
//   return {
//     mediaType: 'DVD',
//     start: DateTime.now().toFormat('yyyy-MM-dd'),
//     batchId: 1,
//     item_number: 'V01/V01/2023',
//     end: DateTime.now().plus({ day: 1 }).toFormat('yyyy-MM-dd'),
//     vaultLocation: 1,
//     remarks: 'remarks-1',
//     protectiveMarking: 1,
//     magTape: {
//       minutes: 1,
//       brand: 'brand',
//       mediaType: 'Paper'
//     },
//     dvd: {
//       size: 1,
//       mediaType: 'DVD'
//     },
//     paper: 'ABC',
//     musterRemarks: 'hello',
//     createdAt: DateTime.now().toFormat('yyyy-MM-dd'),
//     createdBy: 1
//   }
// }

describe('CRUD operations on each resource', () => {
  let provider: DataProvider
  beforeAll(async () => {
    provider = await getDataProvider(false)
  })
  describe('CRUD Operation on Batch', () => {
    let id: number
    let batch: Batch

    it('should create a batch', async () => {
      const data = generateDummyBatchForTesting()
      const result = await provider.create<Batch>(R_BATCHES, {
        data
      })
      id = result.data.id
      batch = result.data
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(data)
    })

    it('should get the batch', async () => {
      const data = generateDummyBatchForTesting()
      const result = await provider.getOne<Batch>(R_BATCHES, { id })
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(data)
    })

    it('should update the batch', async () => {
      const updatedValue = generateDummyBatchForTesting('dummy-batch')
      const result = await provider.update<Batch>(R_BATCHES, {
        id,
        previousData: batch,
        data: {
          name: 'dummy-batch',
          createdAt: DateTime.now().toFormat('yyyy-MM-dd')
        }
      })
      expect(result.data).toEqual(expect.objectContaining(updatedValue))
    })

    it('should delete the batch', async () => {
      await provider.delete<Batch>(R_BATCHES, { id })
    })

    it('should try to get the deleted batch and fail', async () => {
      await expect(async () =>
        await provider.getOne<Batch>(R_BATCHES, { id })
      ).rejects.toThrow()
    })
  })

  //   describe('CRUD Operation on Platform', () => {
  //     let id: number
  //     let platform: Platform

  //     it('should create a platform', async () => {
  //       const data = generateDummyPlatformForTesting()
  //       const result = await provider.create<Platform>(R_PLATFORMS, {
  //         data
  //       })
  //       id = result.data.id
  //       platform = result.data
  //     })

  //     it('should get the platform and log in console', async () => {
  //       const data = await provider.getOne<Platform>(R_PLATFORMS, { id })
  //       console.log({ data })
  //     })

  //     it('should update the platform', async () => {
  //       await provider.update<Platform>(R_PLATFORMS, {
  //         id,
  //         previousData: platform,
  //         data: {
  //           name: 'dummy-platform-1'
  //         }
  //       })
  //     })

  //     it('should log the updated value', async () => {
  //       const result = await provider.getOne(R_PLATFORMS, { id })
  //       console.log({ result })
  //     })

  //     it('should delete the platform', async () => {
  //       await provider.delete<Platform>(R_PLATFORMS, { id })
  //     })
  //   })

  //   describe('CRUD Operation on Project', () => {
  //     let id: number
  //     let project: Project

  //     it('should create a project', async () => {
  //       const data = generateDummyProjectForTesting()
  //       const result = await provider.create<Project>(R_PROJECTS, {
  //         data
  //       })
  //       id = result.data.id
  //       project = result.data
  //     })

  //     it('should get the project and log in console', async () => {
  //       const data = await provider.getOne<Project>(R_PROJECTS, { id })
  //       console.log({ data })
  //     })

  //     it('should update the project', async () => {
  //       await provider.update<Project>(R_PROJECTS, {
  //         id,
  //         previousData: project,
  //         data: {
  //           name: 'dummy-project-1',
  //           createdAt: DateTime.now().toFormat('yyyy-MM-dd')
  //         }
  //       })
  //     })

  //     it('should log the updated value', async () => {
  //       const result = await provider.getOne<Project>(R_PROJECTS, { id })
  //       console.log({ result })
  //     })

  //     it('should delete the project', async () => {
  //       await provider.delete<Project>(R_PROJECTS, { id })
  //     })
  //   })

  //   describe('CRUD Operation on User', () => {
  //     let id: number
  //     let user: User

  //     it('should create a user', async () => {
  //       const data = generateDummyUserForTesting()
  //       const result = await provider.create<User>(R_USERS, {
  //         data
  //       })
  //       id = result.data.id
  //       user = result.data
  //     })

  //     it('should get the user and log in console', async () => {
  //       const data = await provider.getOne<User>(R_USERS, { id })
  //       console.log({ data })
  //     })

  //     it('should update the user', async () => {
  //       await provider.update<User>(R_USERS, {
  //         id,
  //         previousData: user,
  //         data: {
  //           name: 'user-1'
  //         }
  //       })
  //     })

  //     it('should log the updated value', async () => {
  //       const result = await provider.getOne<User>(R_USERS, { id })
  //       console.log({ result })
  //     })

  //     it('should delete the user', async () => {
  //       await provider.delete<User>(R_USERS, { id })
  //     })
  //   })

  //   describe('CRUD Operation on Item', () => {
  //     let id: number
  //     let item: Item

  //     it('should create a item', async () => {
  //       const data = generateDummyItemForTesting()
  //       const result = await provider.create<Item>(R_ITEMS, {
  //         data
  //       })
  //       id = result.data.id
  //       item = result.data
  //     })

  //     it('should get the item and log in console', async () => {
  //       const data = await provider.getOne<Item>(R_ITEMS, { id })
  //       console.log({ data })
  //     })

  //     it('should update the item', async () => {
  //       await provider.update<Item>(R_ITEMS, {
  //         id,
  //         previousData: item,
  //         data: {
  //           name: 'dummy-platform-1',
  //           createdAt: DateTime.now().toFormat('yyyy-MM-dd')
  //         }
  //       })
  //     })

  //     it('should log the updated value', async () => {
  //       const result = await provider.getOne<Item>(R_ITEMS, { id })
  //       console.log({ result })
  //     })

  //     it('should delete the item', async () => {
  //       await provider.delete<Item>(R_ITEMS, { id })
  //     })
  //   })
})
