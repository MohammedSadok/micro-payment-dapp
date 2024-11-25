// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DemoIDL from '../target/idl/demo.json'
import type { Demo } from '../target/types/demo'

// Re-export the generated IDL and type
export { Demo, DemoIDL }

// The programId is imported from the program IDL.
export const DEMO_PROGRAM_ID = new PublicKey(DemoIDL.address)

// This is a helper function to get the Demo Anchor program.
export function getDemoProgram(provider: AnchorProvider) {
  return new Program(DemoIDL as Demo, provider)
}

// This is a helper function to get the program ID for the Demo program depending on the cluster.
export function getDemoProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Demo program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return DEMO_PROGRAM_ID
  }
}
