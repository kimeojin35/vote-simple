// frontend/src/utils/contract.ts
import { InterfaceAbi } from "ethers";

export const contractAddress = "0xYourDeployedContractAddress"; // 배포 후 실제 주소로 바꿔줘

export const contractABI: InterfaceAbi = [
  {
    inputs: [
      { internalType: "string[]", name: "_candidateNames", type: "string[]" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getCandidates",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "uint256", name: "voteCount", type: "uint256" },
        ],
        internalType: "struct SimpleVote.Candidate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_index", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "hasUserVoted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];
