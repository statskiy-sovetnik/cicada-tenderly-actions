const { ethers } = require("ethers");

const actionFn = async (context, blockEvent) => {
  const abi = [
    "function withdraw(uint256 assets, address receiver, address owner) external"
  ];
  const bufferAbi = [
    "function maxWithdraw(address owner) external view returns (uint256)"
  ];
  
  const WITHDRAW_AMOUNT = ethers.utils.parseEther("20");

  const walletPk = await context.secrets.get('CICADA_WALLET_PK')
  
  if (!walletPk) {
    throw new Error("Secret CICADA_WALLET_PK is not set");
  }

  const gatewayURL = context.gateways.getGateway();
  const provider = new ethers.providers.JsonRpcProvider(gatewayURL);

  const bufferAddress = "0x45c3B59d53e2e148Aaa6a857521059676D5c0489";
  const vaultAddress = "0x657d9ABA1DBb59e53f9F3eCAA878447dCfC96dCb";
  const EulerBuffer = new ethers.Contract(bufferAddress, bufferAbi, provider);
  const ynETHX = new ethers.Contract(vaultAddress, abi, provider);

  // Read the buffer maxWithdraw balance
  const maxWithdraw = await EulerBuffer.maxWithdraw(vaultAddress);
  if (maxWithdraw < WITHDRAW_AMOUNT) {
    return; // Not enough funds to withdraw
  }

  // Withdraw funds from the vault

  const wallet = new ethers.Wallet(walletPk ?? "", provider);
  const wallet_address = await wallet.getAddress();
  const ynETHXWithSigner = ynETHX.connect(wallet);

  // Withdraw 20 ETH to the wallet address
  const tx = await ynETHXWithSigner.withdraw(
    WITHDRAW_AMOUNT,
    wallet_address, // receiver
    wallet_address  // owner
  );

  const receipt = await tx.wait();

  console.log(receipt);
}

module.exports = { actionFn }
