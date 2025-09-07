import {
  ActionFn, Context,
  Event, BlockEvent
} from "@tenderly/actions";
 
import { network } from "hardhat";

export const actionFn: ActionFn = async (context: Context, event: Event) => {
  const abi = [
    "function withdraw(uint256 assets, address receiver, address owner) external",
    "function balanceOf(address owner) external view returns (uint256)"
  ];
  const bufferAbi = [
    "function maxWithdraw(address owner) external view returns (uint256)"
  ];

  const hh_network = await network.connect();
  const ethers = hh_network.ethers;

  const WITHDRAW_AMOUNT = ethers.parseEther("0.0009");

  const walletPk = await context.secrets.get('IVAN_PK');
  
  if (!walletPk) {
    throw new Error("Secret CICADA_WALLET_PK is not set");
  }

  const provider = ethers.provider;

  const bufferAddress = "0x45c3B59d53e2e148Aaa6a857521059676D5c0489";
  const vaultAddress = "0x657d9ABA1DBb59e53f9F3eCAA878447dCfC96dCb";
  const EulerBuffer = new ethers.Contract(bufferAddress, bufferAbi, provider);
  const ynETHX = new ethers.Contract(vaultAddress, abi, provider);

  // Read the buffer maxWithdraw balance
  const maxWithdraw = await EulerBuffer.maxWithdraw(vaultAddress);
  if (maxWithdraw < WITHDRAW_AMOUNT) {
    throw new Error("Not enough funds in buffer to withdraw");
  }

  // Create a wallet instance
  const wallet = new ethers.Wallet(walletPk ?? "", provider);
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