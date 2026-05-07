/**
 * pTGC & UFO Portfolio Tracker
 * Complete ecosystem position overview for any wallet
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
const UFO_ADDRESS  = "0x456548A9B56eFBbD89Ca0309edd17a9E20b04018";
const DEAD_ADDRESS = "0x0000000000000000000000000000000000000369";

// ABIs
const PTGC_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() pure returns (uint256)",
  "function decimals() view returns (uint8)",
  "function holders() view returns (uint256)",
  "function lockedAmount(address account) view returns (uint256)",
  "function isHolder(address account) view returns (bool)"
];

const UFO_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() pure returns (uint256)",
  "function decimals() view returns (uint8)",
  "function reflectionFee() view returns (uint256)",
  "function LPProviderFee() view returns (uint256)",
  "function isExcludedFromReflection(address account) view returns (bool)"
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

// Determine pTGC holder tier
function getPTGCHolderTier(balance) {
  const tokens = Number(ethers.formatUnits(balance, 18));
  if (tokens >= 2_900_000_000) return "🐋 Whale";
  if (tokens >= 290_000_000)   return "🦈 Shark";
  if (tokens >= 29_000_000)    return "🐬 Dolphin";
  if (tokens >= 2_900_000)     return "🦑 Squid";
  return "🐟 Fish";
}

// Determine UFO holder tier
function getUFOHolderTier(balance) {
  const tokens = Number(ethers.formatUnits(balance, 18));
  if (tokens >= 9_100_000_000) return "🐋 Whale";
  if (tokens >= 910_000_000)   return "🦈 Shark";
  if (tokens >= 91_000_000)    return "🐬 Dolphin";
  if (tokens >= 9_100_000)     return "🦑 Squid";
  return "🐟 Fish";
}

// Main portfolio tracker
async function trackPortfolio(walletAddress) {
  console.log(`\n📊 Grays Ecosystem Portfolio Tracker`);
  console.log(`Wallet: ${walletAddress}`);
  console.log("─".repeat(50));

  const provider = await getProvider();
  const ptgc = new ethers.Contract(PTGC_ADDRESS, PTGC_ABI, provider);
  const ufo  = new ethers.Contract(UFO_ADDRESS,  UFO_ABI,  provider);

  const [
    ptgcBalance,
    ptgcSupply,
    ptgcHolders,
    ptgcLocked,
    ptgcIsHolder,
    ufoBalance,
    ufoSupply,
    ufoExcluded,
    deadBalance
  ] = await Promise.all([
    ptgc.balanceOf(walletAddress),
    ptgc.totalSupply(),
    ptgc.holders(),
    ptgc.lockedAmount(walletAddress),
    ptgc.isHolder(walletAddress),
    ufo.balanceOf(walletAddress),
    ufo.totalSupply(),
    ufo.isExcludedFromReflection(walletAddress),
    ptgc.balanceOf(DEAD_ADDRESS)
  ]);

  const ptgcPoolShare = (Number(ptgcBalance) / Number(ptgcSupply) * 100).toFixed(6);
  const ufoPoolShare  = (Number(ufoBalance)  / Number(ufoSupply)  * 100).toFixed(6);
  const isLocked = Number(ptgcLocked) > 0;

  console.log("\n🟣 pTGC Position");
  console.log(`  Balance:       ${formatTokens(ptgcBalance)} pTGC`);
  console.log(`  Tier:          ${getPTGCHolderTier(ptgcBalance)}`);
  console.log(`  Pool Share:    ${ptgcPoolShare}%`);
  console.log(`  Locked:        ${isLocked ? formatTokens(ptgcLocked) + " pTGC 🔒" : "None"}`);
  console.log(`  Is Holder:     ${ptgcIsHolder ? "✅ Yes" : "❌ No"}`);
  console.log(`  Total Holders: ${ptgcHolders.toString()}`);

  console.log("\n🛸 UFO Position");
  console.log(`  Balance:      ${formatTokens(ufoBalance)} UFO`);
  console.log(`  Tier:         ${getUFOHolderTier(ufoBalance)}`);
  console.log(`  Pool Share:   ${ufoPoolShare}%`);
  console.log(`  Reflections:  ${ufoExcluded ? "❌ Excluded" : "✅ Earning"}`);

  console.log("\n🔥 Ecosystem Burns");
  console.log(`  pTGC in dead address: ${formatTokens(deadBalance)} pTGC`);
  console.log(`  Dead address: ${DEAD_ADDRESS}`);

  console.log("\n🔗 Useful Links");
  console.log(`  Live metrics:  https://ptgc-ufo.com`);
  console.log(`  dApp:          https://goptgc.com`);
  console.log(`  Explorer:      https://scan.pulsechain.com`);
  console.log(`  DexScreener:   https://dexscreener.com/pulsechain/0xf5a89a6487d62df5308cdda89c566c5b5ef94c11`);

  console.log("\n─".repeat(50));
  console.log("⚠️  This is not financial advice. Always DYOR.");
}

// Run — replace with any wallet address
const WALLET = "0x0000000000000000000000000000000000000000";
trackPortfolio(WALLET).catch(console.error);
