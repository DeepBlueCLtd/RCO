import { type DataProvider } from 'react-admin'
import { getDataProvider, compareVersions } from '.'
import {
  R_BATCHES,
  R_ITEMS,
  R_PLATFORMS,
  R_PROJECTS,
  R_USERS
} from '../../constants'
import { DateTime } from 'luxon'
import { isNumber } from '../../utils/number'
import authProvider, { getUser } from '../authProvider'

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

const generateDummyPlatformForTesting = (
  name?: string
): Omit<Platform, 'id'> => {
  return {
    name: name ?? 'Dummy-Platform-1',
    active: false
  }
}

const generateDummyProjectForTesting = (name?: string): Omit<Project, 'id'> => {
  return {
    name: name ?? 'Dummy-Project-1',
    remarks: 'remarks-1',
    createdAt: DateTime.now().toFormat('yyyy-MM-dd'),
    createdBy: 1
  }
}

const generateDummyUserForTesting = (
  name?: string,
  password?: string
): Omit<User, 'id'> => {
  return {
    name: name ?? 'USER-1',
    password: password ?? '1234',
    adminRights: true
  }
}

const generateDummyItemForTesting = (
  vaultLocation?: number,
  protectiveMarking?: number
): Omit<Item, 'id'> => {
  return {
    mediaType: 'DVD',
    start: DateTime.now().toFormat('yyyy-MM-dd'),
    batchId: 1,
    end: DateTime.now().plus({ day: 1 }).toFormat('yyyy-MM-dd'),
    vaultLocation: vaultLocation ?? 1,
    remarks: 'remarks-1',
    item_number: 'V01/2022',
    protectiveMarking: protectiveMarking ?? 1,
    magTape: {
      minutes: 1,
      brand: 'brand',
      mediaType: 'Paper'
    },
    dvd: {
      size: 1,
      mediaType: 'DVD'
    },
    paper: 'Paper',
    musterRemarks: 'remarks-1',
    createdAt: DateTime.now().toFormat('yyyy-MM-dd'),
    createdBy: 1
  }
}

describe('CRUD operations on each resource', () => {
  let provider: DataProvider
  beforeAll(async () => {
    provider = await getDataProvider(false)
    process.env.password = 'admin'
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
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(updatedValue)
    })

    it('should delete the batch', async () => {
      await provider.delete<Batch>(R_BATCHES, { id })
    })

    it('should try to get the deleted batch and fail', async () => {
      await expect(
        async () => await provider.getOne<Batch>(R_BATCHES, { id })
      ).rejects.toThrow()
    })
  })

  describe('CRUD Operation on Platform', () => {
    let id: number
    let platform: Platform

    it('should create a platform', async () => {
      const data = generateDummyPlatformForTesting()
      const result = await provider.create<Platform>(R_PLATFORMS, {
        data
      })
      id = result.data.id
      platform = result.data
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(data)
    })

    it('should get the platform', async () => {
      const data = generateDummyPlatformForTesting()
      const result = await provider.getOne<Platform>(R_PLATFORMS, { id })
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(data)
    })

    it('should update the platform', async () => {
      const updatedValue = generateDummyPlatformForTesting('dummy-platform-1')

      const result = await provider.update<Platform>(R_PLATFORMS, {
        id,
        previousData: platform,
        data: {
          name: 'dummy-platform-1'
        }
      })
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(updatedValue)
    })

    it('should delete the platform', async () => {
      await provider.delete<Platform>(R_PLATFORMS, { id })
    })

    it('should try to get the deleted platform and fail', async () => {
      await expect(
        async () => await provider.getOne<Platform>(R_PLATFORMS, { id })
      ).rejects.toThrow()
    })
  })

  describe('CRUD Operation on Project', () => {
    let id: number
    let project: Project

    it('should create a project', async () => {
      const data = generateDummyProjectForTesting()
      const result = await provider.create<Project>(R_PROJECTS, {
        data
      })
      id = result.data.id
      project = result.data
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(data)
    })

    it('should get the project', async () => {
      const data = generateDummyProjectForTesting()
      const result = await provider.getOne<Project>(R_PROJECTS, { id })
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(data)
    })

    it('should update the project', async () => {
      const updatedValue = generateDummyProjectForTesting('dummy-project-1')
      const result = await provider.update<Project>(R_PROJECTS, {
        id,
        previousData: project,
        data: {
          name: 'dummy-project-1',
          createdAt: DateTime.now().toFormat('yyyy-MM-dd')
        }
      })

      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(updatedValue)
    })

    it('should delete the project', async () => {
      await provider.delete<Project>(R_PROJECTS, { id })
    })

    it('should try to get the deleted project and fail', async () => {
      await expect(
        async () => await provider.getOne<Project>(R_PROJECTS, { id })
      ).rejects.toThrow()
    })
  })

  describe('CRUD Operation on User', () => {
    let id: number
    let user: User

    it('should create a user', async () => {
      const data = generateDummyUserForTesting(undefined, process.env.password)
      const result = await provider.create<User>(R_USERS, {
        data
      })
      id = result.data.id
      user = result.data
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(data)
    })

    it('should get the user', async () => {
      const data = generateDummyUserForTesting(undefined, process.env.password)
      const result = await provider.getOne<User>(R_USERS, { id })
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(data)
    })

    it('should update the user', async () => {
      const updatedValue = generateDummyUserForTesting(
        'user-1',
        process.env.password
      )
      const result = await provider.update<User>(R_USERS, {
        id,
        previousData: user,
        data: {
          name: 'user-1'
        }
      })
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(updatedValue)
    })

    it('should delete the user', async () => {
      await provider.delete<User>(R_USERS, { id })
    })

    it('should try to get the deleted user and fail', async () => {
      await expect(
        async () => await provider.getOne<User>(R_USERS, { id })
      ).rejects.toThrow()
    })
  })

  describe('CRUD Operation on Item', () => {
    let id: number
    let item: Item

    it('should create a item', async () => {
      const data = generateDummyItemForTesting()
      const result = await provider.create<Item>(R_ITEMS, {
        data
      })
      id = result.data.id
      item = result.data
      const { id: omittedId, ...expectedResult } = result.data
      expect(expectedResult).toEqual(data)
    })

    it('should get the item', async () => {
      const { item_number: omitted, ...data } = generateDummyItemForTesting()
      const result = await provider.getOne<Item>(R_ITEMS, { id })
      const {
        id: omittedId,
        item_number: omittedItemNumber,
        ...expectedResult
      } = result.data

      expect(expectedResult).toEqual(data)
    })

    it('should update the item', async () => {
      const { item_number: omitted, ...updatedValue } =
        generateDummyItemForTesting(2, 3)
      const result = await provider.update<Item>(R_ITEMS, {
        id,
        previousData: item,
        data: {
          vaultLocation: 2,
          protectiveMarking: 3,
          createdAt: DateTime.now().toFormat('yyyy-MM-dd')
        }
      })

      const {
        id: omittedId,
        item_number: omittedItemNumber,
        ...expectedResult
      } = result.data
      expect(expectedResult).toEqual(updatedValue)
    })

    it('should delete the item', async () => {
      await provider.delete<Item>(R_ITEMS, { id })
    })

    it('should try to get the deleted item and fail', async () => {
      await expect(
        async () => await provider.getOne<Item>(R_ITEMS, { id })
      ).rejects.toThrow()
    })
  })
})

describe('Test for isNumber function', () => {
  it('should return true for a number', () => {
    expect(isNumber(42)).toBe(true)
  })

  it('should return true for a numeric string', () => {
    expect(isNumber('42')).toBe(true)
  })

  it('should return false for a non-numeric string', () => {
    expect(isNumber('hello')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isNumber('')).toBe(false)
  })

  it('should return false for null', () => {
    expect(isNumber(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isNumber(undefined)).toBe(false)
  })
})

describe('testing getUser function', () => {
  let provider: DataProvider
  beforeAll(async () => {
    provider = await getDataProvider(false)
  })
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return undefined if no user is stored', () => {
    expect(getUser()).toBeUndefined()
  })

  it('should return the user if one is stored', async () => {
    const user = (await provider.getOne<User>(R_USERS, { id: 1 })).data
    const { password, ...expectedResult } = user
    await authProvider(provider).login({
      username: user.name,
      password: process.env.password ?? 'admin'
    })
    const localStorageUser = getUser()
    expect(localStorageUser).toEqual(expectedResult)
  })
})

describe('testing compareVersions', () => {
  const v1 = 'V01/2020'
  const v2 = 'V02/2020'
  it('should return -1', () => {
    expect(compareVersions(v1, v2)).toBe(-1)
  })

  it('should return 1', () => {
    expect(compareVersions(v2, v1)).toBe(1)
  })

  it('should return return 0', () => {
    expect(compareVersions(v1, v1)).toBe(0)
  })

  it('should return NaN', () => {
    expect(compareVersions('hello', v2)).toBe(NaN)
  })

  it('should return NaN', () => {
    expect(compareVersions(v1, 'hello')).toBe(NaN)
  })

  it('should return NaN', () => {
    expect(compareVersions('hello', 'hello2')).toBe(NaN)
  })
})
