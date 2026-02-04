/**
 * Commitment generation utilities for GrimSwap ZK proofs
 */

import { buildPoseidon } from 'circomlibjs'

// Poseidon instance (initialized lazily)
let poseidonInstance: any = null

/**
 * Initialize Poseidon hash function
 */
export async function initPoseidon() {
  if (!poseidonInstance) {
    poseidonInstance = await buildPoseidon()
  }
  return poseidonInstance
}

/**
 * Compute Poseidon hash
 */
export async function poseidonHash(inputs: bigint[]): Promise<bigint> {
  const poseidon = await initPoseidon()
  const hash = poseidon(inputs)
  return poseidon.F.toObject(hash)
}

/**
 * Generate random 256-bit value
 */
export function randomBigInt(): bigint {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return BigInt('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''))
}

/**
 * Deposit note containing all information needed to withdraw
 */
export interface DepositNote {
  // Private values
  nullifier: bigint
  secret: bigint
  amount: bigint

  // Public/computed values
  commitment: bigint
  nullifierHash: bigint
  leafIndex?: number // Set after deposit is confirmed
  depositTxHash?: string
}

/**
 * Create a new deposit note
 */
export async function createDepositNote(amount: bigint): Promise<DepositNote> {
  const nullifier = randomBigInt()
  const secret = randomBigInt()

  const commitment = await computeCommitment(nullifier, secret, amount)
  const nullifierHash = await computeNullifierHash(nullifier)

  return {
    nullifier,
    secret,
    amount,
    commitment,
    nullifierHash,
  }
}

/**
 * Compute commitment = Poseidon(nullifier, secret, amount)
 */
export async function computeCommitment(
  nullifier: bigint,
  secret: bigint,
  amount: bigint
): Promise<bigint> {
  return poseidonHash([nullifier, secret, amount])
}

/**
 * Compute nullifier hash = Poseidon(nullifier)
 */
export async function computeNullifierHash(nullifier: bigint): Promise<bigint> {
  return poseidonHash([nullifier])
}

/**
 * Format commitment for contract (as hex string)
 */
export function formatCommitmentForContract(commitment: bigint): `0x${string}` {
  return `0x${commitment.toString(16).padStart(64, '0')}`
}

/**
 * Serialize deposit note to string for storage
 */
export function serializeNote(note: DepositNote): string {
  return JSON.stringify({
    nullifier: note.nullifier.toString(),
    secret: note.secret.toString(),
    amount: note.amount.toString(),
    commitment: note.commitment.toString(),
    nullifierHash: note.nullifierHash.toString(),
    leafIndex: note.leafIndex,
    depositTxHash: note.depositTxHash,
  })
}

/**
 * Deserialize deposit note from string
 */
export function deserializeNote(noteString: string): DepositNote {
  const parsed = JSON.parse(noteString)
  return {
    nullifier: BigInt(parsed.nullifier),
    secret: BigInt(parsed.secret),
    amount: BigInt(parsed.amount),
    commitment: BigInt(parsed.commitment),
    nullifierHash: BigInt(parsed.nullifierHash),
    leafIndex: parsed.leafIndex,
    depositTxHash: parsed.depositTxHash,
  }
}

/**
 * Reconstruct deposit note from components
 */
export async function reconstructDepositNote(
  nullifier: bigint,
  secret: bigint,
  amount: bigint,
  leafIndex?: number,
  depositTxHash?: string
): Promise<DepositNote> {
  const commitment = await computeCommitment(nullifier, secret, amount)
  const nullifierHash = await computeNullifierHash(nullifier)

  return {
    nullifier,
    secret,
    amount,
    commitment,
    nullifierHash,
    leafIndex,
    depositTxHash,
  }
}
