export const TEST_CONFIG = {
  SECRET_NAME: 'IVAN_SEED',
  WITHDRAW_AMOUNT_ETH: "0.0009",
  BUFFER_ADDRESS: "0x45c3B59d53e2e148Aaa6a857521059676D5c0489",
  VAULT_ADDRESS: "0x657d9ABA1DBb59e53f9F3eCAA878447dCfC96dCb",
  ABI: {
    BUFFER_ABI: [
      "function maxWithdraw(address owner) external view returns (uint256)"
    ],
    VAULT_ABI: [
      "function withdraw(uint256 assets, address receiver, address owner) external",
      "function balanceOf(address owner) external view returns (uint256)"
    ]
  }
};
