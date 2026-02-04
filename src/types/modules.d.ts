// Type declarations for modules without type definitions

declare module 'circomlibjs' {
  export function buildPoseidon(): Promise<{
    F: {
      toObject(v: any): bigint
    }
    (inputs: bigint[]): Uint8Array
  }>

  export function buildBabyjub(): Promise<{
    F: { toObject(v: any): bigint }
    Base8: any
    mulPointEscalar(base: any, scalar: bigint): any
    addPoint(p1: any, p2: any): any
  }>
}

declare module 'snarkjs' {
  export const groth16: {
    fullProve(
      input: Record<string, any>,
      wasmPath: string,
      zkeyPath: string
    ): Promise<{
      proof: {
        pi_a: string[]
        pi_b: string[][]
        pi_c: string[]
        protocol: string
        curve: string
      }
      publicSignals: string[]
    }>

    verify(
      verificationKey: any,
      publicSignals: string[],
      proof: any
    ): Promise<boolean>
  }
}
