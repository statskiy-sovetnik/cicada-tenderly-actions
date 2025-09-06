import * as TActions from "@tenderly/actions-test";

import { expect } from "chai";

describe("ynETHx withdraw", () => {

  it("sends to discord when a pair created event happens on chain", (done) => {
    const runtime = new TActions.TestRuntime(); 

    // TODO add private key for testing
    runtime.context.secrets.put(
      "CICADA_WALLET_PK",
      ""
    );

    // invoke the runtime
    runtime.execute(onPoolCreatedEventEmitted, txEventCreatePool);

  });

});