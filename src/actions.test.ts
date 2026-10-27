import { describe, expect, expectTypeOf, it } from 'vitest'
import { iamActionDetails, iamActionExists, iamActionsForService } from './actions'

describe('actions', () => {
  describe('iamActionsForService', () => {
    it('return an array of strings', async () => {
      //Given a service that exists
      const service = 's3'

      //When iamActionsForService is called
      const result = await iamActionsForService(service)

      //Then result should be an array of strings
      expect(Array.isArray(result)).toBe(true)
      expect(result.indexOf('GetObject')).toBeGreaterThan(-1)
    })
  })

  describe('iamActionDetails', () => {
    it('return an object with the correct keys', async () => {
      //Given a service and action that exists
      const service = 's3'
      const action = 'GetObject'

      //When iamActionDetails is called
      const result = await iamActionDetails(service, action)

      //Then result should be an object with the correct keys
      expect(result).toHaveProperty('name')
    })

    it('throws an error if the action does not exist', async () => {
      //Given a service that exists but an action that does not
      const service = 's3'
      const action = 'GetBunchesOfObjects'

      //When iamActionDetails is called
      //Then an error should be thrown
      await expect(iamActionDetails(service, action)).rejects.toThrow(
        'Action GetBunchesOfObjects does not exist for service s3'
      )
    })

    it('preserves sparse anonymous-access metadata in the public return type', async () => {
      //Given an action that is not marked as blocking anonymous access
      const service = 's3'
      const action = 'GetObject'

      //When iamActionDetails is called
      const result = await iamActionDetails(service, action)

      //Then the public result supports an optional literal true marker without synthesizing false
      expectTypeOf(result).toMatchTypeOf<{ blockAnon?: true }>()
      expectTypeOf(result.blockAnon).toEqualTypeOf<true | undefined>()
      expect(Object.hasOwn(result, 'blockAnon')).toBe(false)
    })

    it('should return if the action is wildcard only', async () => {
      //Given a service and action that exists
      const service = 's3'
      const action = 'ListAllMyBuckets'

      //When iamActionDetails is called
      const result = await iamActionDetails(service, action)

      //Then result should be an object with the correct keys
      expect(result.isWildcardOnly).toBe(true)
    })

    it('should return if the action is not wildcard only', async () => {
      //Given a service and action that exists
      const service = 's3'
      const action = 'GetObject'

      //When iamActionDetails is called
      const result = await iamActionDetails(service, action)

      //Then result should be an object with the correct keys
      expect(result.isWildcardOnly).toBe(false)
    })
  })

  describe('iamActionExists', () => {
    it('returns true if the action exists', async () => {
      //Given a service and action that exists
      const service = 's3'
      const action = 'GetObject'

      //When iamActionExists is called
      const result = await iamActionExists(service, action)

      //Then result should be true
      expect(result).toBe(true)
    })

    it('returns false if the action does not exist', async () => {
      //Given a service that exists but an action that does not
      const service = 's3'
      const action = 'FakeAction'

      //When iamActionExists is called
      const result = await iamActionExists(service, action)

      //Then result should be false
      expect(result).toBe(false)
    })
  })
})
