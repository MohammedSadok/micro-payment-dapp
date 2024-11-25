import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Demo} from '../target/types/demo'

describe('demo', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Demo as Program<Demo>

  const demoKeypair = Keypair.generate()

  it('Initialize Demo', async () => {
    await program.methods
      .initialize()
      .accounts({
        demo: demoKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([demoKeypair])
      .rpc()

    const currentCount = await program.account.demo.fetch(demoKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Demo', async () => {
    await program.methods.increment().accounts({ demo: demoKeypair.publicKey }).rpc()

    const currentCount = await program.account.demo.fetch(demoKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Demo Again', async () => {
    await program.methods.increment().accounts({ demo: demoKeypair.publicKey }).rpc()

    const currentCount = await program.account.demo.fetch(demoKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Demo', async () => {
    await program.methods.decrement().accounts({ demo: demoKeypair.publicKey }).rpc()

    const currentCount = await program.account.demo.fetch(demoKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set demo value', async () => {
    await program.methods.set(42).accounts({ demo: demoKeypair.publicKey }).rpc()

    const currentCount = await program.account.demo.fetch(demoKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the demo account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        demo: demoKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.demo.fetchNullable(demoKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
