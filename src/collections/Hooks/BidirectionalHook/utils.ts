/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadRequest } from 'payload'
import { BidirectionalConfig } from '.'

/**
 * Normalizes relationship values to an array of IDs
 */
function normalizeToIds(relationships: any[] | undefined): string[] {
  if (!relationships) return []
  // Handle single relationship (not an array)
  if (!Array.isArray(relationships)) {
    const id = typeof relationships === 'string' ? relationships : (relationships as any).id
    return id ? [id] : []
  }
  return relationships.map((item: any) => (typeof item === 'string' ? item : item.id))
}

/**
 * Calculates which items were added and removed from a relationship
 */
export function calculateDifferences(
  currentIds: string[],
  previousIds: string[],
): { toAdd: string[]; toRemove: string[] } {
  const toAdd = currentIds.filter((id) => !previousIds.includes(id))
  const toRemove = previousIds.filter((id) => !currentIds.includes(id))

  return { toAdd, toRemove }
}

/**
 * Adds the current document ID to the target collection's relationship field
 */
export async function addToTargetCollection(
  req: PayloadRequest,
  targetCollection: string,
  targetField: string,
  targetId: string,
  currentDocId: string,
): Promise<void> {
  const targetDoc = await req.payload.findByID({
    collection: targetCollection as any,
    id: targetId,
  })

  const currentRelationships = targetDoc[targetField] || []
  const relationshipIds = normalizeToIds(currentRelationships)

  // Only update if not already present
  if (!relationshipIds.includes(currentDocId)) {
    await req.payload.update({
      collection: targetCollection as any,
      id: targetId,
      data: {
        [targetField]: [...currentRelationships, currentDocId],
      },
    })
  }
}

/**
 * Removes the current document ID from the target collection's relationship field
 */
export async function removeFromTargetCollection(
  req: PayloadRequest,
  targetCollection: string,
  targetField: string,
  targetId: string,
  currentDocId: string,
): Promise<void> {
  const targetDoc = await req.payload.findByID({
    collection: targetCollection as any,
    id: targetId,
  })

  const currentRelationships = targetDoc[targetField] || []
  const filteredRelationships = currentRelationships.filter((item: any) => {
    const itemId = typeof item === 'string' ? item : item.id
    return itemId !== currentDocId
  })

  await req.payload.update({
    collection: targetCollection as any,
    id: targetId,
    data: {
      [targetField]: filteredRelationships,
    },
  })
}

/**
 * Synchronizes bidirectional relationships between two collections
 */
export async function syncBidirectionalRelationship(
  config: BidirectionalConfig,
  currentDoc: any,
  previousDoc: any,
  req: PayloadRequest,
): Promise<void> {
  const { relationshipField, targetCollection, targetField } = config

  // Get current and previous relationship IDs
  const currentIds = normalizeToIds(currentDoc[relationshipField])
  const previousIds = normalizeToIds(previousDoc?.[relationshipField])

  // Calculate what changed
  const { toAdd, toRemove } = calculateDifferences(currentIds, previousIds)

  // Add current document to newly related target documents
  for (const targetId of toAdd) {
    await addToTargetCollection(req, targetCollection, targetField, targetId, currentDoc.id)
  }

  // Remove current document from no-longer-related target documents
  for (const targetId of toRemove) {
    await removeFromTargetCollection(req, targetCollection, targetField, targetId, currentDoc.id)
  }
}
