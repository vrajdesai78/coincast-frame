import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  parseEther,
} from "viem";
import { morphSepolia, arbitrumSepolia } from "viem/chains";
import { NFTABI } from "./abi";
import { privateKeyToAccount } from "viem/accounts";

export const getMetadata = async (contract: string) => {
  const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(),
  });

  const nftContract = getContract({
    address: contract as `0x${string}`,
    abi: NFTABI,
    client: publicClient,
  });

  const contractUri = await nftContract.read.uri([0]);

  console.log("contractUri", contractUri);

  const metadata = await fetch(contractUri as string);

  const data = (await metadata.json()) as {
    name: string;
    description: string;
    image: string;
  };

  return data;
};

export const mintNFT = async (contract: string, address: string) => {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(
      "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public"
    ),
  });

  const client = createWalletClient({
    account,
    chain: arbitrumSepolia,
    transport: http(
      "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public"
    ),
  });

  const data = await publicClient.readContract({
    account: "0x1c4C98d2EAd474876a9E84e2Ba8ff226cc9a161c",
    address: contract as `0x${string}`,
    abi: NFTABI,
    functionName: "counter",
    args: [],
  });

  console.log("price", data);

  const { request } = await publicClient.simulateContract({
    account: "0x3039e4a4a540F35ae03A09f3D5A122c49566f919",
    address: contract as `0x${string}`,
    abi: NFTABI,
    functionName: "nftMint",
    value: data as bigint,
  });

  console.log("simulate contract request", request);

  const hash = await client.writeContract(request);

  //   console.log("mint hash", hash);

  //   const counter = await publicClient.readContract({
  //     address: contract as `0x${string}`,
  //     abi: NFTABI,
  //     functionName: "counter",
  //   });

  //   const transfer = await client.writeContract({
  //     account: "0x1c4C98d2EAd474876a9E84e2Ba8ff226cc9a161c",
  //     address: contract as `0x${string}`,
  //     abi: NFTABI,
  //     functionName: "safeTransferFrom",
  //     args: [
  //       "0x1c4C98d2EAd474876a9E84e2Ba8ff226cc9a161c",
  //       address,
  //       counter,
  //       1,
  //       "0x00",
  //     ],
  //   });
  //   console.log("transfer hash", hash);

  //   return transfer;
};
