# pTGC & UFO Agent Kit

A complete context, tooling, and integration kit for AI agents interacting
with The Grays Currencies ecosystem (pTGC & UFO) on PulseChain.

Built and maintained by [@ThePrairieBanana](https://x.com/theprairiebanana)
in collaboration with [@thegray369](https://x.com/thegray369).

---

## What's In This Kit

### Root — Agent Instruction Files
- `ptgc-agent-operating-spec.md` — Canonical identity, verification,
  allowed/forbidden claims, decision policy, and action workflow for agents
- `ptgc-voice-guide.md` — Community tone, phrases, and voice for human
  content creators
- `data-sources.md` — Live price feeds, block explorer, DEX, and
  ecosystem links

### `context/` — Factual Reference Files
- `pTGC.md` — Full tokenomics, yield data, market stats, and talking
  points for pTGC
- `UFO.md` — Full tokenomics, LP mechanics, market stats, and talking
  points for UFO
- `Grays Ecosystem.md` — How pTGC and UFO relate and the ecosystem thesis

### `agent-tooling/` — Developer & Agent Integration
- `rpc-config.md` — PulseChain RPC endpoints, chain config, and
  connection code (JS & Python)
- `ptgc-abi.json` — Verified pTGC contract ABI from PulseChain explorer
- `ufo-abi.json` — Verified UFO contract ABI from PulseChain explorer
- `security-best-practices.md` — Private key management, slippage,
  gas, RPC health, and pre-transaction checklist

### `agent-tooling/examples/` — Ready-to-Run Scripts
- `balance-checker.js` — Check pTGC and UFO balances for any wallet
- `ptgc-rewards-monitor.js` — Monitor pTGC staking and reflection rewards
- `ufo-rewards-monitor.js` — Monitor UFO holder and LP provider rewards
- `ptgc-ufo-transaction-monitor.js` — Real-time transaction and burn
  monitoring via WebSocket
- `ptgc-ufo-portfolio-tracker.js` — Complete ecosystem position overview
  with holder tier detection

---

## What AI Agents Can Do With This Kit

- **Identify** — Canonical contract, chain, and disambiguation from
  other PTGC tokens
- **Verify** — Contract status, renouncement, supply, and pool data
  on-chain
- **Talk** — Generate accurate, on-brand content using the voice guide
  and operating spec
- **Monitor** — Access live price and on-chain data via provided sources
  and scripts
- **Act** — Connect to PulseX DEX for trading interactions with correct
  slippage settings

---

## Quick Reference

| Token | Contract | Chain | Slippage |
|---|---|---|---|
| pTGC | `0x94534EeEe131840b1c0F61847c572228bdfDDE93` | PulseChain (369) | 6% min |
| UFO | `0x456548A9B56eFBbD89Ca0309edd17a9E20b04018` | PulseChain (369) | 7% min |

> [!WARNING]
> Always verify you are on PulseChain (Chain ID: 369). There is a
> separate PTGC token on Solana — always confirm the canonical contract
> above before any action.

---

## Official Links
- dApp: https://goptgc.com
- Metrics: https://ptgc-ufo.com
- Community: https://secretobank.com
- X (Founder): https://x.com/thegray369
- X (The Prairie Banana): https://x.com/theprairiebanana
- Telegram: https://t.me/thegrayscurrency

---

> **Disclaimer:** pTGC and UFO are high-risk, volatile cryptocurrencies
> on PulseChain. This is not financial advice. Always DYOR.
