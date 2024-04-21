import { NFTABI } from "@/utils/abi";
import { mintNFT } from "@/utils/contractFunctions";
import { getFrameMessage } from "frames.js";
import { createFrames, Button } from "frames.js/next";
import { createPublicClient, getContract, http } from "viem";
import { baseSepolia } from "viem/chains";

const frames = createFrames();
const handleRequest = frames(async (ctx) => {
  const { searchParams } = new URL(ctx.url);
  const address = searchParams.get("address");

  const frameMessage = await getFrameMessage(await ctx.request.json());
  const { requesterVerifiedAddresses } = frameMessage;

  if (requesterVerifiedAddresses && address) {
    const hash = await mintNFT(address, requesterVerifiedAddresses[0]);
    console.log("mint hash", hash);
  }

  return {
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "whitesmoke",
          width: "100%",
          height: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "10px",
          }}
        >
          You have minted successfully!
        </h1>
      </div>
    ),
    buttons: [
      <Button
        action='tx'
        key={1}
        target={`${process.env.NEXT_PUBLIC_HOST_URL}/tx?address=${address}`}
        post_url={`${process.env.NEXT_PUBLIC_HOST_URL}/tx-success?address=${address}`}
      >
        Mint
      </Button>,
      <Button
        action='post'
        key={2}
        target={`${process.env.NEXT_PUBLIC_HOST_URL}/frames?address=${address}`}
      >
        Show Preview
      </Button>,
    ],
    accepts: [
      {
        id: "farcaster",
        version: "vNext",
      },
      {
        id: "xmtp",
        version: "vNext",
      },
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
