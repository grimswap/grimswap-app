/**
 * Unified IndexedDB initialization for GrimSwap
 * Creates all required object stores in a single database
 */

export const DB_NAME = 'grimswap-db'
export const DB_VERSION = 2 // Increment to add merkle-trees store

export const STORES = {
  DEPOSIT_NOTES: 'deposit-notes',
  MERKLE_TREES: 'merkle-trees',
} as const

let dbInstance: IDBDatabase | null = null

/**
 * Initialize IndexedDB with all required stores
 */
export function openDB(): Promise<IDBDatabase> {
  // Return cached instance if available
  if (dbInstance) {
    return Promise.resolve(dbInstance)
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Failed to open database:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create deposit-notes store
      if (!db.objectStoreNames.contains(STORES.DEPOSIT_NOTES)) {
        const notesStore = db.createObjectStore(STORES.DEPOSIT_NOTES, {
          keyPath: 'id',
          autoIncrement: true,
        })

        // Indexes for querying
        notesStore.createIndex('commitment', 'commitment', { unique: true })
        notesStore.createIndex('nullifierHash', 'nullifierHash', { unique: true })
        notesStore.createIndex('spent', 'spent', { unique: false })
        notesStore.createIndex('tokenAddress', 'tokenAddress', { unique: false })
        notesStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      // Create merkle-trees store
      if (!db.objectStoreNames.contains(STORES.MERKLE_TREES)) {
        db.createObjectStore(STORES.MERKLE_TREES, { keyPath: 'id' })
      }
    }
  })
}

/**
 * Close the database connection
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}
