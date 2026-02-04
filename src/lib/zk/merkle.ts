/**
 * Merkle tree utilities for GrimSwap ZK proofs
 */

import { poseidonHash } from './commitment'

export const MERKLE_TREE_HEIGHT = 20 // 2^20 = 1,048,576 leaves
export const ZERO_VALUE = BigInt(0)

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
 * Simplified Merkle tree implementation
 */
export class MerkleTree {
  private height: number
  private leaves: bigint[]
  private zeros: bigint[] // Zero values for each level
  private layers: bigint[][] // Cache of tree layers

  constructor(height: number = MERKLE_TREE_HEIGHT) {
    this.height = height
    this.leaves = []
    this.zeros = []
    this.layers = []
  }

  /**
   * Initialize the tree with zero values
   */
  async initialize(): Promise<void> {
    // Compute zero values for each level
    this.zeros = [ZERO_VALUE]
    for (let i = 1; i <= this.height; i++) {
      this.zeros[i] = await poseidonHash([this.zeros[i - 1], this.zeros[i - 1]])
    }

    // Initialize layers
    this.layers = Array.from({ length: this.height + 1 }, () => [])
    this.layers[0] = []
  }

  /**
   * Insert a new leaf (commitment)
   */
  async insert(leaf: bigint): Promise<number> {
    const index = this.leaves.length
    this.leaves.push(leaf)

    // Clear cached layers (will be rebuilt on next root calculation)
    this.layers = Array.from({ length: this.height + 1 }, () => [])

    return index
  }

  /**
   * Get current root
   */
  async getRoot(): Promise<bigint> {
    if (this.leaves.length === 0) {
      return this.zeros[this.height]
    }

    // Build tree from leaves
    let currentLevel = [...this.leaves]

    // Pad with zeros to next power of 2
    const capacity = 2 ** this.height
    while (currentLevel.length < capacity) {
      currentLevel.push(this.zeros[0])
    }

    this.layers[0] = currentLevel

    // Build tree level by level
    for (let level = 1; level <= this.height; level++) {
      const prevLevel = this.layers[level - 1]
      const currentLevelNodes: bigint[] = []

      for (let i = 0; i < prevLevel.length; i += 2) {
        const left = prevLevel[i]
        const right = prevLevel[i + 1] !== undefined ? prevLevel[i + 1] : this.zeros[level - 1]
        const parent = await poseidonHash([left, right])
        currentLevelNodes.push(parent)
      }

      this.layers[level] = currentLevelNodes

      if (currentLevelNodes.length === 1) {
        return currentLevelNodes[0]
      }
    }

    return this.layers[this.height][0]
  }

  /**
   * Get Merkle proof for a leaf
   */
  async getProof(leafIndex: number): Promise<MerkleProof> {
    if (leafIndex >= this.leaves.length) {
      throw new Error(`Leaf index ${leafIndex} out of bounds (${this.leaves.length} leaves)`)
    }

    // Ensure tree is built
    await this.getRoot()

    const pathElements: bigint[] = []
    const pathIndices: number[] = []

    let currentIndex = leafIndex

    for (let level = 0; level < this.height; level++) {
      const isLeft = currentIndex % 2 === 0
      const siblingIndex = isLeft ? currentIndex + 1 : currentIndex - 1

      let sibling: bigint
      if (siblingIndex < this.layers[level].length) {
        sibling = this.layers[level][siblingIndex]
      } else {
        sibling = this.zeros[level]
      }

      pathElements.push(sibling)
      pathIndices.push(isLeft ? 0 : 1)

      currentIndex = Math.floor(currentIndex / 2)
    }

    const root = await this.getRoot()
    const leaf = this.leaves[leafIndex]

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
    return this.leaves.length
  }

  /**
   * Get all leaves
   */
  getLeaves(): bigint[] {
    return [...this.leaves]
  }

  /**
   * Export tree state
   */
  exportState(): { height: number; leaves: string[] } {
    return {
      height: this.height,
      leaves: this.leaves.map(l => l.toString()),
    }
  }

  /**
   * Import tree state
   */
  async importState(state: { height: number; leaves: string[] }): Promise<void> {
    this.height = state.height
    this.leaves = state.leaves.map(l => BigInt(l))
    await this.initialize()
    await this.getRoot() // Build tree
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
