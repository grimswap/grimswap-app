/**
 * GrimSwap ZK library
 *
 * Utilities for generating ZK proofs for private swaps
 */

// Commitment functions
export {
  initPoseidon,
  poseidonHash,
  randomBigInt,
  createDepositNote,
  computeCommitment,
  computeNullifierHash,
  formatCommitmentForContract,
  serializeNote,
  deserializeNote,
  reconstructDepositNote,
  type DepositNote,
} from './commitment'

// Merkle tree
export {
  MerkleTree,
  MERKLE_TREE_HEIGHT,
  ZERO_VALUE,
  formatProofForCircuit,
  buildMerkleTree,
  type MerkleProof,
} from './merkle'

// Proof generation
export {
  generateProof,
  formatProofForContract,
  encodeProofAsHookData,
  verifyProofLocally,
  generateProofForRelayer,
  estimateProofTime,
  supportsWebWorkers,
  type Groth16Proof,
  type PublicSignals,
  type ContractProof,
  type SwapParams,
} from './proof'
