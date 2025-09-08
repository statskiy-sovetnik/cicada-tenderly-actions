import { configVariable, type HardhatUserConfig } from "hardhat/config";

import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin],
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
      forking: {
        url: configVariable("MAINNET_RPC_URL"),
        blockNumber: 23317342
      },
    },
    mainnet: {
      type: "http",
      url: configVariable("MAINNET_RPC_URL"),
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
  },

  test: {
    mocha: {
      timeout: 200000,
    }
  }
};

export default config;
