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

  return {
    image:
      "https://telehealth-chat-files.s3.ap-south-1.amazonaws.com/3bd27784-29c0-4711-9e12-b91f5b488a8d",
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
