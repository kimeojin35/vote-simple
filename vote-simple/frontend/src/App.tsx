import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./utils/contract";

type Candidate = {
  name: string;
  voteCount: number;
};

export default function App() {
  const [wallet, setWallet] = useState<string>("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask를 설치해주세요!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWallet(account);

      const voted = await contract.hasUserVoted(account);
      setHasVoted(voted);

      const data = await contract.getCandidates();
      setCandidates(
        data.map((c: any) => ({
          name: c.name,
          voteCount: Number(c.voteCount),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = async (index: number) => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      await contract.vote(index);
      setHasVoted(true);

      const data = await contract.getCandidates();
      setCandidates(
        data.map((c: any) => ({
          name: c.name,
          voteCount: Number(c.voteCount),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // 자동 연결된 지갑 있는 경우 불러오기
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          connectWallet();
        }
      }
    };

    init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        🗳️ Simple Vote DApp
      </h1>

      {!wallet ? (
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          지갑 연결하기
        </button>
      ) : (
        <>
          <p className="text-gray-700 mb-4">
            지갑 주소:{" "}
            <span className="font-mono">
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </span>
          </p>

          {hasVoted ? (
            <p className="text-green-600 font-semibold">
              ✅ 이미 투표하셨습니다!
            </p>
          ) : (
            <div className="grid gap-4 mt-4 w-full max-w-md">
              {candidates.map((c, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h2 className="text-lg font-medium">{c.name}</h2>
                    <p className="text-sm text-gray-500">
                      득표수: {c.voteCount}
                    </p>
                  </div>
                  <button
                    onClick={() => handleVote(index)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    투표
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
