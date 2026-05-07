/**
 * UFO Rewards Monitor
 * Monitors UFO holder balance, reflections, and LP provider status
 * PulseChain — Chain ID 369
 * 
 * Note: UFO has no staking. Yield comes from:
 * 1. Reflections (1% of all fees) — appear automatically in wallet
 * 2. LP Provider rewards (3% of all fees) — check via goptgc.com
 */

import { ethers } from "ethers";

// RPC endpoints — rotates on failure
const RPC_URLS = [
  "https://rpc.pulsechain.com",
  "https://pulsechain-rpc.publicnode.com",
  "https://rpc.pulsechainrpc.com"
];

// Contract addresses
const UFO_ADDRESS = "0x456548A9B56eFBbD89Ca0309edd17a9E20b04018";

// UFO burns pTGC on every transaction — showing pTGC balance
// gives a complete picture of the holder's ecosystem position
const PTGC_ADDRESS = "0x94534EeEe131840b1c0F61847c572228bdfDDE93";

// ABI — balance and reflection functions
const UFO_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() pure returns (uint256)",
  "function decimals() view returns (uint8)",
  "function reflectionFee() view returns (uint256)",
  "function LPProviderFee() view returns (uint256)",
  "function isliquidityPair(address account) view returns (bool)",
  "function isExcludedFromReflection(address account) view returns (bool)"
];

const PTGC_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() pure returns (uint256)",
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

// Main UFO rewards monitor
async function checkUFORewards(walletAddress) {
  console.log(`\nUFO Rewards Monitor: ${walletAddress}`);
  console.log("─".repeat(50));

  const provider = await getProvider();
  const ufo  = new ethers.Contract(UFO_ADDRESS,  UFO_ABI,  provider);
  const ptgc = new ethers.Contract(PTGC_ADDRESS, PTGC_ABI, provider);

  const [
    ufoBalance,
    ufoSupply,
    ptgcBalance,
    reflectionFee,
    lpProviderFee,
    isExcluded
  ] = await Promise.all([
    ufo.balanceOf(walletAddress),
    ufo.totalSupply(),
    ptgc.balanceOf(walletAddress),
    ufo.reflectionFee(),
    ufo.LPProviderFee(),
    ufo.isExcludedFromReflection(walletAddress)
  ]);

  const poolShare = (Number(ufoBalance) / Number(ufoSupply) * 100).toFixed(6);

  console.log("\n🛸 UFO Balance");
  console.log(`  UFO Balance:   ${formatTokens(ufoBalance)} UFO`);
  console.log(`  Pool Share:    ${poolShare}%`);
  console.log(`  Reflections:   ${isExcluded ? "❌ Excluded" : "✅ Earning automatically"}`);

  console.log("\n💰 pTGC Balance");
  console.log(`  pTGC Balance:  ${formatTokens(ptgcBalance)} pTGC`);
  console.log(`  Note: UFO burns pTGC on every transaction`);

  console.log("\n📊 UFO Fee Structure");
  console.log(`  Reflection fee:    ${reflectionFee.toString()}% to holders`);
  console.log(`  LP Provider fee:   ${lpProviderFee.toString()}% to LP providers`);
  console.log(`  UFO burn fee:      1% burned per transaction`);
  console.log(`  pTGC burn fee:     1% pTGC burned per transaction`);

  console.log("\n🏊 LP Provider Rewards");
  console.log(`  LP rewards are tracked by UFO shares`);
  console.log(`  1 UFO in LP = 1 UFO share (fixed, never changes)`);
  console.log(`  Check your LP rewards at: https://goptgc.com`);

  console.log("\n─".repeat(50));
  console.log("✅ Verify live stats at ptgc-ufo.com");
  console.log("✅ Verify on-chain at https://scan.pulsechain.com");
}

// Run — replace with any wallet address
const WALLET = "0x0000000000000000000000000000000000000000";
checkUFORewards(WALLET).catch(console.error);
