import * as TActions from "@tenderly/actions-test";
import { expect } from "chai";

//Read IVAN_PK from .env file
import * as dotenv from "dotenv";
dotenv.config();

import { network } from "hardhat";
import * as hardhat from "hardhat";
//import { actionFn } from '../src/mock_ynethx_action.ts';
import { actionFn } from '../src/mock_ynethx_action_v6_ethers.ts';

describe("ynETHx withdraw", () => {

  it("Withdraw using Ivan's wallet", async () => {
    const runtime = new TActions.TestRuntime();

    // Performing tests on a hardhat mainnet fork
    const hh_network = await network.connect();
    const ethers = hh_network.ethers;
    
    if (!process.env.IVAN_PK) {
      throw new Error("Please set IVAN_PK in the .env file");
    }

    // Storing private key as a secret
    runtime.context.secrets.put(
      "IVAN_PK",
      process.env.IVAN_PK
    );

    // Invoke the mock action
    const mockEvent = new TActions.TestTransactionEvent();
    await runtime.execute(actionFn, mockEvent);

  });

});