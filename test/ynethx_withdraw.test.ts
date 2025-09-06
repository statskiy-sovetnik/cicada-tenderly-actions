import * as TActions from "@tenderly/actions-test";

import { expect } from "chai";

describe("ynETHx withdraw", () => {

  it("sends to discord when a pair created event happens on chain", (done) => {
    const runtime = new TActions.TestRuntime();
    const txEventCreatePool =
      CreatePoolEventPayload as TActions.TestTransactionEvent;

    runtime.context.secrets.put(
      "discord.uniswapChannelWebhook",
      DISCORD_WEBHOOK
    );

    stubTheGraphResponse();

    // invoke the runtime
    runtime.execute(onPoolCreatedEventEmitted, txEventCreatePool);

    // wait a bit and then check if Discord got the expected message
    setTimeout(() => {
      //
      const discordData = JSON.parse(
        moxios.requests.get("post", DISCORD_WEBHOOK).config.data
      );
      expect(discordData).to.deep.equal({
        content: "🐥 USD Coin IN TEST ↔️ Wrapped Ether IN TEST",
      });
      done();
    }, 500);
  });

});