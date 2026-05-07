# PulseChain RPC Configuration

Last updated: May 2026

This file provides everything an AI agent needs to connect to PulseChain
and interact with pTGC and UFO contracts.

## Chain Details
- Network: PulseChain Mainnet
- Chain ID: 369
- Currency: PLS
- Block Explorer: https://scan.pulsechain.com

## RPC Endpoints (HTTP)
Use these in order of preference — if one fails, rotate to the next:

1. https://rpc.pulsechain.com (official, most stable)
2. https://pulsechain-rpc.publicnode.com
3. https://rpc.pulsechainrpc.com

## RPC Endpoints (WebSocket)
For real-time event subscriptions and monitoring:

1. wss://pulsechain-rpc.publicnode.com

## Contract Addresses
- pTGC: 0x94534EeEe131840b1c0F61847c572228bdfDDE93
- UFO: 0x456548A9B56eFBbD89Ca0309edd17a9E20b04018
- Dead Address: 0x0000000000000000000000000000000000000369
- PulseX Router: 0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02

- Note: pTGC requires 6% slippage, UFO requires 7% slippage.
Slippage is auto-configured on goptgc.com.

## Quick Connect — JavaScript (ethers.js)
```javascript
import { ethers } from "ethers";

const RPC_URLS = [
  "https://rpc.pulsechain.com",
  "https://pulsechain-rpc.publicnode.com",
  "https://rpc.pulsechainrpc.com"
];

async function getProvider() {
  for (const url of RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getBlockNumber();
      console.log(`Connected to: ${url}`);
      return provider;
    } catch {
      console.warn(`Failed: ${url}, trying next...`);
    }
  }
  throw new Error("All RPC endpoints failed");
}
```

## Quick Connect — Python (web3.py)
```python
from web3 import Web3

RPC_URLS = [
    "https://rpc.pulsechain.com",
    "https://pulsechain-rpc.publicnode.com",
    "https://rpc.pulsechainrpc.com"
]

def get_connection():
    for url in RPC_URLS:
        try:
            w3 = Web3(Web3.HTTPProvider(url))
            if w3.is_connected():
                print(f"Connected to: {url}")
                return w3
        except Exception:
            print(f"Failed: {url}, trying next...")
    raise Exception("All RPC endpoints failed")

w3 = get_connection()
```

## Quick Connect — WebSocket (ethers.js)
```javascript
import { ethers } from "ethers";

const wsProvider = new ethers.WebSocketProvider(
  "wss://pulsechain-rpc.publicnode.com"
);

// Listen for new blocks
wsProvider.on("block", (blockNumber) => {
  console.log("New block:", blockNumber);
});
```

## RPC Health Check
Always verify your connection before executing transactions:

```javascript
async function checkRPCHealth(provider) {
  try {
    const blockNumber = await provider.getBlockNumber();
    const network = await provider.getNetwork();
    console.log(`Block: ${blockNumber}, Chain ID: ${network.chainId}`);
    return true;
  } catch {
    return false;
  }
}
```

## Notes for Agents
- Always implement RPC rotation — no single endpoint is guaranteed
- Chain ID 369 must match in all transaction signing
- PLS is used for gas — ensure wallets maintain a minimum PLS balance
- Read-only operations (balance checks, reflection reads) are free
- Write operations (buy, stake, lock) require PLS for gas
