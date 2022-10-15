import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { AnchorBasics } from '../target/types/anchor_basics'
import { assert } from 'chai'

describe('anchor-basics', () => {
  // Use a local provider.
  const provider = anchor.AnchorProvider.local()

  // Configure the client to use the local cluster.
  anchor.setProvider(provider)

  // The program to execute.
  const program = anchor.workspace.AnchorBasics as Program<AnchorBasics>

  let _myAccount

  it('Creates and initializes an account in a single atomic transaction (simplified)', async () => {
    // #region code-simplified

    // The Account to create.
    const myAccount = anchor.web3.Keypair.generate()

    // Create the new account and initialize it with the program.
    // #region code-simplified
    await program.methods
      .initialize()
      .accounts({
        myAccount: myAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([myAccount])
      .rpc()
    // #endregion code-simplified

    // Fetch the newly created account from the cluster.
    const account = await program.account.myAccount.fetch(myAccount.publicKey)

    // Check it's state was initialized.
    assert.ok(account.data.eq(new anchor.BN(0)));

    // Store the account for the next test.
    _myAccount = myAccount
  })

  it('Updates a previously created account', async () => {
    const myAccount = _myAccount

    // #region update-test

    // Invoke the update rpc.
    await program.methods
      .update(new anchor.BN(100))
      .accounts({
        myAccount: myAccount.publicKey,
      })
      .rpc()

    // Fetch the newly updated account.
    const account = await program.account.myAccount.fetch(myAccount.publicKey)

    // Check it's state was mutated.
    assert.ok(account.data.eq(new anchor.BN(100)));

    // #endregion update-test
  })

  it('Increment', async () => {
    const myAccount = _myAccount

    // #region update-test

    // Invoke the update rpc.
    await program.methods
      .increment()
      .accounts({
        myAccount: myAccount.publicKey,
      })
      .rpc()

    // Fetch the newly updated account.
    const account = await program.account.myAccount.fetch(myAccount.publicKey)

    // Check it's state was mutated.
    assert.ok(account.data.eq(new anchor.BN(101)));

    // #endregion update-test
  })

  it('Decrement', async () => {
    const myAccount = _myAccount

    // #region update-test

    // Invoke the update rpc.
    await program.methods
      .decrement()
      .accounts({
        myAccount: myAccount.publicKey,
      })
      .rpc()

    // Fetch the newly updated account.
    const account = await program.account.myAccount.fetch(myAccount.publicKey)

    // Check it's state was mutated.
    assert.ok(account.data.eq(new anchor.BN(100)));

    // #endregion update-test
  })
})
