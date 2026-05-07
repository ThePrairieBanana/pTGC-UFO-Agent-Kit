# Security Best Practices for AI Agents

Last updated: May 2026

This file outlines security requirements for any AI agent interacting
with pTGC, UFO, or PulseChain on behalf of users.

---

## 🔑 Private Key Management

**Never hard-code private keys — ever.**

```javascript
// ❌ NEVER do this
const privateKey = "0xabc123...";

// ✅ Always load from environment variables
const privateKey = process.env.PRIVATE_KEY;
```

- Store private keys in environment variables or a secrets manager
- Never log, print, or expose private keys in any output
- Never commit `.env` files to version control
- Add `.env` to your `.gitignore` immediately

---

## 👁️ Read vs Write Permissions

**Default to read-only. Require explicit confirmation for writes.**

Read-only operations (safe, no risk):
- Checking balances
- Reading reflection amounts
- Monitoring transactions
- Fetching supply data

Write operations (require user confirmation):
- Buying pTGC or UFO
- Staking tokens
- Locking tokens
- Unlocking tokens
- Any transaction that costs PLS gas

```javascript
// Always confirm before executing write operations
async function executeTransaction(tx, description) {
  console.log(`\n⚠️  About to execute: ${description}`);
  console.log(`   Estimated gas: ${await tx.estimateGas()} PLS`);
  console.log(`   Confirm? (yes/no)`);
  // Wait for explicit user confirmation before proceeding
}
```

---

## 🔄 RPC Rate Limiting & Retry Logic

Always implement retry logic with exponential backoff:

```javascript
async function withRetry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.warn(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
}

// Usage
const balance = await withRetry(() => ptgc.balanceOf(wallet));
```

---

## ⛽ Gas Management

- Always maintain a minimum PLS balance for gas
- Estimate gas before executing transactions
- Never execute transactions if gas estimation fails
- Recommended minimum PLS reserve: ~50 PLS

```javascript
async function checkGasBalance(provider, walletAddress) {
  const balance = await provider.getBalance(walletAddress);
  const plsBalance = parseFloat(ethers.formatEther(balance));
  
  if (plsBalance < 10) {
    throw new Error(`Insufficient PLS for gas: ${plsBalance} PLS`);
  }
  return plsBalance;
}
```

---

## 🔍 Transaction Simulation

Always simulate transactions before executing:

```javascript
async function simulateTransaction(contract, method, args) {
  try {
    await contract[method].staticCall(...args);
    console.log("✅ Simulation passed — safe to execute");
    return true;
  } catch (error) {
    console.error("❌ Simulation failed:", error.message);
    return false;
  }
}
```

---

## 🌐 RPC Health Monitoring

Monitor RPC health and rotate on failure:

```javascript
async function checkRPCHealth(url) {
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const blockNumber = await Promise.race([
      provider.getBlockNumber(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      )
    ]);
    return { url, healthy: true, blockNumber };
  } catch {
    return { url, healthy: false };
  }
}

// Check all RPCs
const RPC_URLS = [
  "https://rpc.pulsechain.com",
  "https://pulsechain-rpc.publicnode.com",
  "https://rpc.pulsechainrpc.com"
];

const health = await Promise.all(RPC_URLS.map(checkRPCHealth));
const healthyRPCs = health.filter(r => r.healthy);
console.log(`${healthyRPCs.length}/${RPC_URLS.length} RPCs healthy`);
```

---

## ✅ Pre-Transaction Checklist

Before any write operation, verify:

- [ ] Private key loaded from environment, not hard-coded
- [ ] Sufficient PLS balance for gas
- [ ] Transaction simulated successfully
- [ ] User has explicitly confirmed the action
- [ ] Contract address matches verified addresses in `rpc-config.md`
- [ ] Chain ID is 369 (PulseChain)
- [ ] RPC endpoint is healthy

---

## ⚠️ General Rules

- Never store wallet credentials in GitHub repositories
- Never execute trades autonomously without user confirmation
- Always verify contract addresses against `rpc-config.md`
- Always include the disclaimer: "This is not financial advice"
- Respect rate limits — add delays between batch requests
- Log all transactions for auditability
- Never interact with unverified contracts

---

## 🔗 Verified Contract Addresses

Always cross-reference against these verified addresses:

- pTGC: `0x94534EeEe131840b1c0F61847c572228bdfDDE93`
- UFO: `0x456548A9B56eFBbD89Ca0309edd17a9E20b04018`
- Dead Address: `0x0000000000000000000000000000000000000369`
- PulseX Router: `0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02`

Verify all contracts at: https://scan.pulsechain.com
