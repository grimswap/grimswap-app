/**
 * Sparse Merkle tree utilities for GrimSwap ZK proofs
 * Optimized to only compute necessary hashes, not the full 2^20 tree
 */

import { poseidonHash } from './commitment'

export const MERKLE_TREE_HEIGHT = 20 // 2^20 = 1,048,576 leaves
// This is Poseidon(0), the standard zero value used in ZK circuits
// MUST match the circuit's zero value exactly
export const ZERO_VALUE = BigInt('21663839004416932945382355908790599225266501822907911457504978515578255421292')

/**
 * Merkle proof for a leaf
 */
export interface MerkleProof {
  pathElements: bigint[] // Sibling hashes along the path
  pathIndices: number[] // 0 = left, 1 = right
  root: bigint
  leaf: bigint
  leafIndex: number
}

/**
 * Pre-computed zero hashes for each level (computed once)
 */
let cachedZeros: bigint[] | null = null

async function getZeros(height: number): Promise<bigint[]> {
  if (cachedZeros && cachedZeros.length > height) {
    return cachedZeros
  }

  const zeros: bigint[] = [ZERO_VALUE]
  for (let i = 1; i <= height; i++) {
    zeros[i] = await poseidonHash([zeros[i - 1], zeros[i - 1]])
  }

  cachedZeros = zeros
  return zeros
}

/**
 * Sparse Merkle tree implementation
 * Only stores actual leaves and computes hashes on-demand
 */
export class MerkleTree {
  private height: number
  private leaves: Map<number, bigint> // Sparse storage: index -> leaf value
  private leafCount: number
  private zeros: bigint[]
  private nodeCache: Map<string, bigint> // Cache computed nodes

  constructor(height: number = MERKLE_TREE_HEIGHT) {
    this.height = height
    this.leaves = new Map()
    this.leafCount = 0
    this.zeros = []
    this.nodeCache = new Map()
  }

  /**
   * Initialize the tree with zero values
   */
  async initialize(): Promise<void> {
    this.zeros = await getZeros(this.height)
  }

  /**
   * Insert a new leaf (commitment)
   */
  async insert(leaf: bigint): Promise<number> {
    const index = this.leafCount
    this.leaves.set(index, leaf)
    this.leafCount++
    this.nodeCache.clear() // Invalidate cache
    return index
  }

  /**
   * Get node at specific position, using zeros for empty positions
   */
  private getLeaf(index: number): bigint {
    return this.leaves.get(index) ?? this.zeros[0]
  }

  /**
   * Compute hash for a node, with caching
   */
  private async computeNode(level: number, index: number): Promise<bigint> {
    const cacheKey = `${level}-${index}`

    if (this.nodeCache.has(cacheKey)) {
      return this.nodeCache.get(cacheKey)!
    }

    let result: bigint

    if (level === 0) {
      // Leaf level
      result = this.getLeaf(index)
    } else {
      // Check if entire subtree is empty (all zeros)
      const subtreeSize = Math.pow(2, level)
      const startLeaf = index * subtreeSize
      const endLeaf = startLeaf + subtreeSize

      // If no leaves in this subtree, use pre-computed zero
      let hasLeaves = false
      for (let i = startLeaf; i < endLeaf && i < this.leafCount; i++) {
        if (this.leaves.has(i)) {
          hasLeaves = true
          break
        }
      }

      if (!hasLeaves && startLeaf >= this.leafCount) {
        // Entire subtree is zeros
        result = this.zeros[level]
      } else {
        // Compute from children
        const leftChild = await this.computeNode(level - 1, index * 2)
        const rightChild = await this.computeNode(level - 1, index * 2 + 1)
        result = await poseidonHash([leftChild, rightChild])
      }
    }

    this.nodeCache.set(cacheKey, result)
    return result
  }

  /**
   * Get current root - only computes necessary hashes
   */
  async getRoot(): Promise<bigint> {
    if (this.leafCount === 0) {
      return this.zeros[this.height]
    }
    return this.computeNode(this.height, 0)
  }

  /**
   * Get Merkle proof for a leaf - only computes necessary path
   */
  async getProof(leafIndex: number): Promise<MerkleProof> {
    if (leafIndex >= this.leafCount) {
      throw new Error(`Leaf index ${leafIndex} out of bounds (${this.leafCount} leaves)`)
    }

    const pathElements: bigint[] = []
    const pathIndices: number[] = []

    let currentIndex = leafIndex

    for (let level = 0; level < this.height; level++) {
      const isLeft = currentIndex % 2 === 0
      const siblingIndex = isLeft ? currentIndex + 1 : currentIndex - 1

      // Get sibling hash
      const sibling = await this.computeNode(level, siblingIndex)

      pathElements.push(sibling)
      pathIndices.push(isLeft ? 0 : 1)

      currentIndex = Math.floor(currentIndex / 2)
    }

    const root = await this.getRoot()
    const leaf = this.getLeaf(leafIndex)

    return {
      pathElements,
      pathIndices,
      root,
      leaf,
      leafIndex,
    }
  }

  /**
   * Verify a Merkle proof
   */
  async verifyProof(proof: MerkleProof): Promise<boolean> {
    let currentHash = proof.leaf

    for (let i = 0; i < proof.pathElements.length; i++) {
      const sibling = proof.pathElements[i]
      const isLeft = proof.pathIndices[i] === 0

      if (isLeft) {
        currentHash = await poseidonHash([currentHash, sibling])
      } else {
        currentHash = await poseidonHash([sibling, currentHash])
      }
    }

    return currentHash === proof.root
  }

  /**
   * Get number of leaves
   */
  getLeafCount(): number {
    return this.leafCount
  }

  /**
   * Get all leaves as array
   */
  getLeaves(): bigint[] {
    const result: bigint[] = []
    for (let i = 0; i < this.leafCount; i++) {
      result.push(this.getLeaf(i))
    }
    return result
  }

  /**
   * Export tree state
   */
  exportState(): { height: number; leaves: string[] } {
    return {
      height: this.height,
      leaves: this.getLeaves().map(l => l.toString()),
    }
  }

  /**
   * Import tree state
   */
  async importState(state: { height: number; leaves: string[] }): Promise<void> {
    this.height = state.height
    this.leaves = new Map()
    this.leafCount = 0
    this.nodeCache = new Map()

    await this.initialize()

    for (const leafStr of state.leaves) {
      await this.insert(BigInt(leafStr))
    }
  }
}

/**
 * Format Merkle proof for circuit input
 */
export function formatProofForCircuit(proof: MerkleProof): {
  pathElements: string[]
  pathIndices: number[]
} {
  return {
    pathElements: proof.pathElements.map(e => e.toString()),
    pathIndices: proof.pathIndices,
  }
}

/**
 * Build Merkle tree from list of commitments
 */
export async function buildMerkleTree(commitments: bigint[]): Promise<MerkleTree> {
  const tree = new MerkleTree()
  await tree.initialize()

  for (const commitment of commitments) {
    await tree.insert(commitment)
  }

  return tree
}
