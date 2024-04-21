import { NFTABI } from "@/utils/abi";
import { getMetadata } from "@/utils/contractFunctions";
import { createFrames, Button } from "frames.js/next";
import { createPublicClient, getContract, http } from "viem";
import { arbitrumSepolia } from "viem/chains";

const frames = createFrames();
const handleRequest = frames(async (ctx) => {
  const { searchParams } = new URL(ctx.url);
  const address = searchParams.get("address");

  if(!address) {
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
            No address provided
          </h1>
        </div>
      ),
      buttons: [
        <Button
          action='post'
          key={1}
          target={`${process.env.NEXT_PUBLIC_HOST_URL}/frames`}
        >
          Retry
        </Button>,
      ],
    };
  }

  const { name, description } = await getMetadata(address);

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
          {name}
        </h1>
        <p
          style={{
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          {description}
        </p>
      </div>
    ),
    buttons: [
      <Button
        action='tx'
        key={1}
        target={`${process.env.NEXT_PUBLIC_HOST_URL}/tx?address=${address}`}
        post_url={`${process.env.NEXT_PUBLIC_HOST_URL}/tx-success?address=${address}`}
      >
        Buy Now
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
