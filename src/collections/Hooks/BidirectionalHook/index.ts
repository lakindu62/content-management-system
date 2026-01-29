import { CollectionAfterChangeHook } from 'payload'
import { syncBidirectionalRelationship } from './utils'

/**
 * Configuration for bidirectional relationship synchronization
 */
export interface BidirectionalConfig {
  /** The field in the current collection that references the target collection */
  relationshipField: string
  /** The target collection to update */
  targetCollection: string
  /** The field in the target collection that should reference back to this document */
  targetField: string
}

/**
 * Creates a reusable afterChange hook for bidirectional relationships
 *
 * @example
 * ```ts
 * hooks: {
 *   afterChange: [
 *     createBidirectionalHook({
 *       relationshipField: 'relatedIndustries',
 *       targetCollection: 'industries',
 *       targetField: 'Products'
 *     })
 *   ]
 * }
 * ```
 */
export function createBidirectionalHook(config: BidirectionalConfig): CollectionAfterChangeHook {
  return async ({ doc, req, previousDoc, operation }) => {
    // Only run on update operations to prevent infinite loops
    if (operation !== 'update') {
      return doc
    }

    try {
      await syncBidirectionalRelationship(config, doc, previousDoc, req)
    } catch (error) {
      req.payload.logger.error(`Error syncing bidirectional relationship: ${error}`)
      // Don't throw - allow the main operation to succeed even if sync fails
    }

    return doc
  }
}

/**
 * Creates multiple bidirectional hooks for a collection
 * Useful when a collection has multiple bidirectional relationships
 *
 * @example
 * ```ts
 * hooks: {
 *   afterChange: [
 *     ...createBidirectionalHooks([
 *       {
 *         relationshipField: 'relatedIndustries',
 *         targetCollection: 'industries',
 *         targetField: 'Products'
 *       },
 *       {
 *         relationshipField: 'relatedPosts',
 *         targetCollection: 'posts',
 *         targetField: 'relatedProducts'
 *       }
 *     ])
 *   ]
 * }
 * ```
 */
export function createBidirectionalHooks(
  configs: BidirectionalConfig[],
): CollectionAfterChangeHook[] {
  return configs.map((config) => createBidirectionalHook(config))
}
