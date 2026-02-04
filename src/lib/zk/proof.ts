/**
 * ZK proof generation using snarkjs
 */

import { groth16 } from 'snarkjs'
import type { Address } from 'viem'
import type { DepositNote } from './commitment'
import type { MerkleProof } from './merkle'
import { formatProofForCircuit } from './merkle'

// Circuit files paths (in public directory)
const WASM_PATH = '/circuits/privateSwap.wasm'
const ZKEY_PATH = '/circuits/privateSwap_final.zkey'

/**
 * Groth16 proof in snarkjs format
 */
export interface Groth16Proof {
  pi_a: string[]
  pi_b: string[][]
  pi_c: string[]
  protocol: string
  curve: string
}

/**
 * Public signals for the circuit
 */
export interface PublicSignals {
  merkleRoot: bigint
  nullifierHash: bigint
  recipient: Address
  relayer: Address
  relayerFee: bigint
  amountIn: bigint
  minAmountOut: bigint
  poolKey: bigint // Encoded pool identifier
}

/**
 * Contract-formatted proof
 */
export interface ContractProof {
  a: [bigint, bigint]
  b: [[bigint, bigint], [bigint, bigint]]
  c: [bigint, bigint]
  input: bigint[]
}

/**
 * Swap parameters for proof generation
 */
export interface SwapParams {
  recipient: Address
  relayer: Address
  relayerFee: number // Basis points (100 = 1%)
  amountIn: bigint
  minAmountOut: bigint
  poolKey: bigint
}

/**
 * Generate ZK proof for private swap
 */
export async function generateProof(
  note: DepositNote,
  merkleProof: MerkleProof,
  swapParams: SwapParams,
  onProgress?: (stage: string, progress: number) => void
): Promise<{ proof: Groth16Proof; publicSignals: string[] }> {
  if (!note.leafIndex && note.leafIndex !== 0) {
    throw new Error('Deposit note must have leafIndex set')
  }

  onProgress?.('Preparing inputs', 0.1)

  // Format Merkle proof for circuit
  const { pathElements, pathIndices } = formatProofForCircuit(merkleProof)

  // Prepare circuit inputs
  const circuitInputs = {
    // Private inputs
    secret: note.secret.toString(),
    nullifier: note.nullifier.toString(),
    amount: note.amount.toString(),
    pathElements,
    pathIndices,

    // Public inputs
    merkleRoot: merkleProof.root.toString(),
    nullifierHash: note.nullifierHash.toString(),
    recipient: BigInt(swapParams.recipient).toString(),
    relayer: BigInt(swapParams.relayer).toString(),
    relayerFee: swapParams.relayerFee.toString(),
    amountIn: swapParams.amountIn.toString(),
    minAmountOut: swapParams.minAmountOut.toString(),
    poolKey: swapParams.poolKey.toString(),
  }

  onProgress?.('Generating witness', 0.3)

  try {
    // Generate witness and proof
    const { proof, publicSignals } = await groth16.fullProve(
      circuitInputs,
      WASM_PATH,
      ZKEY_PATH
    )

    onProgress?.('Proof generated', 1.0)

    return { proof, publicSignals }
  } catch (error) {
    console.error('Proof generation failed:', error)
    throw new Error(`Failed to generate proof: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Format proof for smart contract
 */
export function formatProofForContract(
  proof: Groth16Proof,
  publicSignals: string[]
): ContractProof {
  // Convert string arrays to bigints
  const a: [bigint, bigint] = [
    BigInt(proof.pi_a[0]),
    BigInt(proof.pi_a[1]),
  ]

  const b: [[bigint, bigint], [bigint, bigint]] = [
    [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])], // Note: reversed for Solidity
    [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
  ]

  const c: [bigint, bigint] = [
    BigInt(proof.pi_c[0]),
    BigInt(proof.pi_c[1]),
  ]

  const input = publicSignals.map(s => BigInt(s))

  return { a, b, c, input }
}

/**
 * Encode proof as hook data for Uniswap v4
 */
export function encodeProofAsHookData(contractProof: ContractProof): `0x${string}` {
  // This would use ABI encoding - simplified for now
  // In production, use viem's encodeAbiParameters
  const encoded = JSON.stringify(contractProof)
  return `0x${Buffer.from(encoded).toString('hex')}`
}

/**
 * Verify proof locally (before submitting)
 */
export async function verifyProofLocally(
  proof: Groth16Proof,
  publicSignals: string[]
): Promise<boolean> {
  try {
    // Verification key should be loaded from file
    const vKeyResponse = await fetch('/circuits/verification_key.json')
    const vKey = await vKeyResponse.json()

    const isValid = await groth16.verify(vKey, publicSignals, proof)
    return isValid
  } catch (error) {
    console.error('Local verification failed:', error)
    return false
  }
}

/**
 * Generate proof for relayer submission
 */
export async function generateProofForRelayer(
  note: DepositNote,
  merkleProof: MerkleProof,
  swapParams: SwapParams,
  onProgress?: (stage: string, progress: number) => void
): Promise<{
  proof: Groth16Proof
  publicSignals: string[]
  contractProof: ContractProof
  isValid: boolean
}> {
  // Generate proof
  const { proof, publicSignals } = await generateProof(
    note,
    merkleProof,
    swapParams,
    onProgress
  )

  // Verify locally
  onProgress?.('Verifying proof', 0.9)
  const isValid = await verifyProofLocally(proof, publicSignals)

  if (!isValid) {
    throw new Error('Generated proof is invalid')
  }

  // Format for contract
  const contractProof = formatProofForContract(proof, publicSignals)

  return {
    proof,
    publicSignals,
    contractProof,
    isValid,
  }
}

/**
 * Estimate proof generation time
 */
export function estimateProofTime(): number {
  // Typical browser proof generation: ~1-2 seconds
  // Native (Node.js): ~200-400ms
  const isBrowser = typeof window !== 'undefined'
  return isBrowser ? 1500 : 300 // milliseconds
}

/**
 * Check if Web Workers are available for proof generation
 */
export function supportsWebWorkers(): boolean {
  return typeof Worker !== 'undefined'
}
