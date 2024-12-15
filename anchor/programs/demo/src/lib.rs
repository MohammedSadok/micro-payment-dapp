#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod demo {
    use super::*;

  pub fn close(_ctx: Context<CloseDemo>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.demo.count = ctx.accounts.demo.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.demo.count = ctx.accounts.demo.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeDemo>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.demo.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeDemo<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Demo::INIT_SPACE,
  payer = payer
  )]
  pub demo: Account<'info, Demo>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseDemo<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub demo: Account<'info, Demo>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub demo: Account<'info, Demo>,
}

#[account]
#[derive(InitSpace)]
pub struct Demo {
  count: u8,
}
