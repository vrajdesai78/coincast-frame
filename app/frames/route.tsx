import { farcasterHubContext } from "frames.js/middleware";
import { createPublicClient, getContract, http } from "viem";
import { createFrames, Button } from "frames.js/next";
import { arbitrumSepolia } from "viem/chains";
import { NFTABI, extractStringFromUrl } from "@/utils/abi";
import { getMetadata } from "@/utils/contractFunctions";

const frames = createFrames({
  basePath: "/frames",
  middleware: [
    farcasterHubContext({
      // remove if you aren't using @frames.js/debugger or you just don't want to use the debugger hub
      ...(process.env.NODE_ENV === "production"
        ? {}
        : {
            hubHttpUrl: "http://localhost:3010/hub",
          }),
    }),
  ],
});

const handleRequest = frames(async (ctx) => {
  const { searchParams } = new URL(ctx.url);
  const address = searchParams.get("address");

  if (!address) {
    return {
      image: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "linear-gradient(to bottom, #3399FF, #3399FF)",
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

  const data = await getMetadata(address);

  console.log(data);

  return {
    image: data.image,
    buttons: [
      <Button
        action='post'
        key={1}
        target={`${process.env.NEXT_PUBLIC_HOST_URL}/mint?address=${address}`}
      >
        Mint
      </Button>,
      <Button
        action='post'
        key={2}
        target={`${process.env.NEXT_PUBLIC_HOST_URL}/showDetails?address=${address}`}
      >
        Show Details
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
