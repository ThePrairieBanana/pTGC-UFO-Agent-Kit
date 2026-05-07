/**
 * pTGC Rewards Monitor
 * Monitors staking rewards, reflection balance, and lock status
 * PulseChain — Chain ID 369
 */

import { ethers } from "ethers";

// RPC endpoints — rotates on failure
const RPC_URLS = [
  "https://rpc.pulsechain.com",
  "https://pulsechain-rpc.publicnode.com",
  "https://rpc.pulsechainrpc.com"
];

// Contract addresses
const PTGC_ADDRESS = "0x94534EeEe131840b1c0F61847c572228bdfDDE93";

// ABI — staking and locking functions
const REWARDS_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() pure returns (uint256)",
  "function rOwned(address account) view returns (uint256)",
  "function lockedAmount(address account) view returns (uint256)",
  "function stakingContract() view returns (address)",
  "function decimals() view returns (uint8)"
];

// Connect with RPC rotation
async function getProvider() {
  for (const url of RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getBlockNumber();
      return provider;
    } catch {
      console.warn(`RPC failed: ${url}, trying next...`);
    }
  }
  throw new Error("All RPC endpoints failed");
}

// Format token amounts
function formatTokens(raw, decimals = 18) {
  return parseFloat(ethers.formatUnits(raw, decimals)).toLocaleString();
}

// Main rewards monitor
async function checkRewards(walletAddress) {
  console.log(`\nRewards Monitor: ${walletAddress}`);
  console.log("─".repeat(50));

  const provider = await getProvider();
  const ptgc = new ethers.Contract(PTGC_ADDRESS, REWARDS_ABI, provider);

  const [
    balance,
    totalSupply,
    lockedAmount,
  ] = await Promise.all([
    ptgc.balanceOf(walletAddress),
    ptgc.totalSupply(),
    ptgc.lockedAmount(walletAddress),
  ]);

  const poolShare = (Number(balance) / Number(totalSupply) * 100).toFixed(6);
  const isLocked = Number(lockedAmount) > 0;

  console.log("\n💰 Wallet Summary");
  console.log(`  pTGC Balance:  ${formatTokens(balance)} pTGC`);
  console.log(`  Pool Share:    ${poolShare}%`);
  console.log(`  Locked Amount: ${formatTokens(lockedAmount)} pTGC`);
  console.log(`  Lock Status:   ${isLocked ? "🔒 Locked" : "🔓 Not locked"}`);

  console.log("\n📈 Yield Info");
  console.log(`  Reflections:   Appear automatically in wallet`);
  console.log(`  Staking APY:   ~165% more than holding`);
  console.log(`  Claim rewards: https://goptgc.com/staking`);

  console.log("\n─".repeat(50));
  console.log("✅ Verify live rewards at ptgc-ufo.com");
  console.log("✅ Verify on-chain at https://scan.pulsechain.com");
}

// Run — replace with any wallet address
const WALLET = "0x0000000000000000000000000000000000000000";
checkRewards(WALLET).catch(console.error);
