import { readActionData } from './data.js'

/**
 * Resource-type requirements and related action metadata for an IAM action.
 */
export interface ActionResourceType {
  name: string
  required: boolean
  conditionKeys: string[]
  dependentActions: string[]
}

/**
 * IAM action metadata returned by the public action-data API.
 */
export interface Action {
  name: string
  description: string
  accessLevel: 'Read' | 'Write' | 'List' | 'Tagging'
  resourceTypes: ActionResourceType[]
  conditionKeys: string[]
  dependentActions: string[]
  isWildcardOnly: boolean
  /**
   * Present only when AWS rejects unsigned requests for this action regardless of resource policy.
   */
  blockAnon?: true
}

/**
 * Get all actions for a service
 *
 * @param serviceKey the service key to get actions for, is case insensitive
 * @returns the actions for the service
 */
export async function iamActionsForService(serviceKey: string): Promise<string[]> {
  const data = await readActionData<Record<string, Action>>(serviceKey.toLowerCase())
  return Object.values(data).map((action) => action.name)
}

/**
 * Check if an action exists
 *
 * @param serviceKey the service key to check for the action, is case insensitive
 * @param actionKey the action key to check for, is case insensitive
 * @returns true if the action exists, false otherwise
 */
export async function iamActionExists(serviceKey: string, actionKey: string): Promise<boolean> {
  const data = await readActionData<Record<string, Action>>(serviceKey.toLowerCase())
  return !!data[actionKey.toLowerCase()]
}

/**
 * Get the details for an action
 *
 * @param serviceKey the service key to get the action for, is case insensitive
 * @param actionKey the action key to get the details for, is case insensitive
 * @throws error if the service or action does not exist
 * @returns the details for the action
 */
export async function iamActionDetails(serviceKey: string, actionKey: string): Promise<Action> {
  const data = await readActionData<Record<string, Action>>(serviceKey.toLowerCase())
  const actionData = data[actionKey.toLowerCase()]
  if (!actionData) {
    throw new Error(`Action ${actionKey} does not exist for service ${serviceKey}`)
  }

  return {
    ...actionData,
    isWildcardOnly: actionData.resourceTypes.length === 0
  }
}
