import * as TActions from "@tenderly/actions-test";
import { expect } from "chai";
//Read IVAN_PK from .env file
import * as dotenv from "dotenv";
dotenv.config();
import { actionFn } from '../src/mock_ynethx_action_v6_ethers.ts';

describe("ynETHx withdraw", () => {

  it("Withdraw using Ivan's wallet", async () => {
    const runtime = new TActions.TestRuntime();

    if (!process.env.IVAN_SEED) {
      throw new Error("Please set IVAN_SEED in the .env file");
    }

    // Storing private key as a secret
    runtime.context.secrets.put(
      "IVAN_SEED",
      process.env.IVAN_SEED
    );

    // Invoke the mock action
    const mockEvent = new TActions.TestTransactionEvent();
    await runtime.execute(actionFn, mockEvent);

  });

});