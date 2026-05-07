/**
 * pTGC & UFO Transaction Monitor
 * Monitors real-time transactions, fee distributions, and burn events
 * PulseChain — Chain ID 369
 */

import { ethers } from "ethers";

// WebSocket endpoint for real-time monitoring
const WS_URL = "wss://pulsechain-rpc.publicnode.com";

// Fallback HTTP endpoints
const RPC_URLS = [
  "https://rpc.pulsechain.com",
  "https://pulsechain-rpc.publicnode.com",
  "https://rpc.pulsechainrpc.com"
];

// Contract addresses
const PTGC_ADDRESS = "0x94534EeEe131840b1c0F61847c572228bdfDDE93";
const UFO_ADDRESS  = "0x456548A9B56eFBbD89Ca0309edd17a9E20b04018";
const DEAD_ADDRESS = "0x0000000000000000000000000000000000000369";

// Transfer event ABI
const TRANSFER_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function totalSupply() pure returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// Format token amounts
function formatTokens(raw, decimals = 18) {
  return parseFloat(ethers.formatUnits(raw, decimals)).toLocaleString();
}

// Get HTTP provider with rotation
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

// Monitor pTGC transactions in real-time
async function monitorTransactions() {
  console.log("\n🔍 pTGC & UFO Transaction Monitor");
  console.log("─".repeat(50));
  console.log("Connecting to PulseChain WebSocket...\n");

  // Use WebSocket for real-time events
  const wsProvider = new ethers.WebSocketProvider(WS_URL);
  const httpProvider = await getProvider();

  const ptgc = new ethers.Contract(PTGC_ADDRESS, TRANSFER_ABI, wsProvider);
  const ufo  = new ethers.Contract(UFO_ADDRESS,  TRANSFER_ABI, wsProvider);

  // Get current supply for context
  const ptgcHttp = new ethers.Contract(PTGC_ADDRESS, TRANSFER_ABI, httpProvider);
  const currentSupply = await ptgcHttp.totalSupply();
  console.log(`Current pTGC supply: ${formatTokens(currentSupply)}`);
  console.log("─".repeat(50));
  console.log("Listening for transactions...\n");

  // Monitor pTGC transfers
  ptgc.on("Transfer", (from, to, value, event) => {
    const amount = formatTokens(value);
    const isBurn = to.toLowerCase() === DEAD_ADDRESS.toLowerCase();
    const isLP   = from.toLowerCase() === DEAD_ADDRESS.toLowerCase();

    if (isBurn) {
      console.log(`🔥 pTGC BURN: ${amount} pTGC sent to dead address`);
      console.log(`   TX: ${event.log.transactionHash}`);
    } else if (!isLP) {
      console.log(`💸 pTGC Transfer: ${amount} pTGC`);
      console.log(`   From: ${from}`);
      console.log(`   To:   ${to}`);
      console.log(`   TX:   ${event.log.transactionHash}`);
    }
    console.log("");
  });

  // Monitor UFO transfers
  ufo.on("Transfer", (from, to, value, event) => {
    const amount = formatTokens(value);
    const isBurn = to.toLowerCase() === DEAD_ADDRESS.toLowerCase();

    if (isBurn) {
      console.log(`🔥 UFO BURN: ${amount} UFO sent to dead address`);
      console.log(`   TX: ${event.log.transactionHash}`);
      console.log("");
    }
  });

  // Handle WebSocket disconnection
  wsProvider.on("error", (error) => {
    console.error("WebSocket error:", error);
    console.log("Attempting to reconnect...");
    setTimeout(monitorTransactions, 5000);
  });

  console.log("✅ Monitoring active. Press Ctrl+C to stop.\n");
}

monitorTransactions().catch(console.error);
