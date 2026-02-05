/**
 * IndexedDB storage for Merkle tree state
 */

import { openDB, STORES } from './db'

const STORE_NAME = STORES.MERKLE_TREES

export interface StoredMerkleTree {
  id: string // Chain ID + Pool address
  height: number
  leaves: string[] // Commitments as strings
  lastSyncedBlock: number
  lastUpdated: number
  root: string
}

/**
 * Save Merkle tree state
 */
export async function saveMerkleTreeState(state: StoredMerkleTree): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(state)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Load Merkle tree state
 */
export async function loadMerkleTreeState(id: string): Promise<StoredMerkleTree | null> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Delete Merkle tree state
 */
export async function deleteMerkleTreeState(id: string): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Clear all Merkle tree states
 */
export async function clearAllMerkleTrees(): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
