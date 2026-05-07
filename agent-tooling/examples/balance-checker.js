/**
 * pTGC & UFO Balance Checker
 * Checks wallet balances and pending reflections for pTGC and UFO
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

// Minimal ABI — only what we need for balance checks
const BALANCE_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() pure returns (uint256)",
  "function decimals() view returns (uint8)",
  "function holders() view returns (uint256)"
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

// Main checker
async function checkWallet(walletAddress) {
  console.log(`\nChecking wallet: ${walletAddress}`);
  console.log("─".repeat(50));

  const provider = await getProvider();

  const ptgc = new ethers.Contract(PTGC_ADDRESS, BALANCE_ABI, provider);
  const ufo  = new ethers.Contract(UFO_ADDRESS,  BALANCE_ABI, provider);

  // Fetch balances
  const [
    ptgcBalance,
    ufoBalance,
    ptgcSupply,
    ptgcHolders
  ] = await Promise.all([
    ptgc.balanceOf(walletAddress),
    ufo.balanceOf(walletAddress),
    ptgc.totalSupply(),
    ptgc.holders()
  ]);

  // Calculate pool share
  const poolShare = (Number(ptgcBalance) / Number(ptgcSupply) * 100).toFixed(6);

  console.log("\n📊 pTGC");
  console.log(`  Balance:     ${formatTokens(ptgcBalance)} pTGC`);
  console.log(`  Pool share:  ${poolShare}%`);
  console.log(`  Total supply: ${formatTokens(ptgcSupply)} pTGC`);
  console.log(`  Total holders: ${ptgcHolders.toString()}`);

  console.log("\n🛸 UFO");
  console.log(`  Balance:     ${formatTokens(ufoBalance)} UFO`);

  console.log("\n─".repeat(50));
  console.log("✅ Always verify live stats at ptgc-ufo.com");
}

// Run — replace with any wallet address
const WALLET = "0x0000000000000000000000000000000000000000";
checkWallet(WALLET).catch(console.error);
