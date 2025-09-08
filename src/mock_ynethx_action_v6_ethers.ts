import {
  ActionFn, Context,
  Event, BlockEvent
} from "@tenderly/actions";
 
import { network } from "hardhat";
import { TEST_CONFIG } from "./config/test_config.ts";


export const actionFn: ActionFn = async (context: Context, event: Event) => {

  const hh_network = await network.connect();
  const ethers = hh_network.ethers;

  const WITHDRAW_AMOUNT = ethers.parseEther(TEST_CONFIG.WITHDRAW_AMOUNT_ETH);
  const walletSeed = await context.secrets.get(TEST_CONFIG.SECRET_NAME);

  if (!walletSeed) {
    throw new Error(`Secret ${TEST_CONFIG.SECRET_NAME} is not set`);
  }

  const provider = ethers.provider;

  const EulerBuffer = new ethers.Contract(
    TEST_CONFIG.BUFFER_ADDRESS, 
    TEST_CONFIG.ABI.BUFFER_ABI, 
    provider
  );
  const ynETHX = new ethers.Contract(
    TEST_CONFIG.VAULT_ADDRESS, 
    TEST_CONFIG.ABI.VAULT_ABI, 
    provider
  );

  // Read the buffer maxWithdraw balance
  const maxWithdraw = await EulerBuffer.maxWithdraw(TEST_CONFIG.VAULT_ADDRESS);
  if (maxWithdraw < WITHDRAW_AMOUNT) {
    throw new Error("Not enough funds in buffer to withdraw");
  }

  // Create a wallet instance
  const wallet = ethers.Wallet.fromPhrase(walletSeed).connect(provider);
  const wallet_address = await wallet.getAddress();
  console.log("Wallet address:", wallet_address);
  const ynETHXWithSigner = ynETHX.connect(wallet);

  // Check that wallet has enough ynETHx balance
  const balance = await ynETHX.balanceOf(wallet_address);
  if (balance < WITHDRAW_AMOUNT) {
    throw new Error("Not enough ynETHx balance to withdraw");
  }

  // Withdraw 20 ETH to the wallet address
  //@ts-ignore
  const tx = await ynETHXWithSigner.withdraw(
    WITHDRAW_AMOUNT,
    wallet_address, // receiver
    wallet_address  // owner
  );

  await tx.wait();

  // Read balance after
  const balance_after = await ynETHX.balanceOf(wallet_address);
  console.log("Balance before:", ethers.formatEther(balance));
  console.log("Balance after: ", ethers.formatEther(balance_after));
}