# *Space DAO Contracts

Token contracts for the *Space Wyoming DAO LLC. Governance, staking, treasury, and founder-transition contracts are roadmap designs and are not implemented or audited here.

---

## 🌟 Token System

**SpaceMoney (SM)** - Economic Token
- Standard transferable ERC-20
- Fixed maximum supply of 1 billion SM, minted to the deployer at deployment
- Holders can burn their own tokens

**SpaceTime (ST)** - Governance Token
- Role-gated minting and burning
- Non-transferable (soulbound)
- Starts with zero supply
- Records a decay timestamp when minted, but does not currently apply decay; `effectiveBalance()` returns the token balance unchanged

---

## 🗳️ Governance Roadmap

The following model describes intended future contracts, not executable behavior in the current repository.

**Proportional Voting:**
- Each proposal specifies budget: X% SM + Y% ST
- Voting weight: X% from SM holders, Y% from ST holders
- Those whose resources fund proposals control decisions

**Founder Veto:**
- Initial state: 100% veto power on all proposals
- Sunset triggers when:
  - 99.9% proposal acceptance for 5 consecutive years
  - 10,000+ distinct ST earners
  - <20% treasury held by founder
- Result: Veto burns, pure proportional democracy

**SM Staking:**
- Stake for 1-25 years for vote multiplier
- Staking capacity capped by ST balance
- If ST drops below threshold → auto-proposal for forced unstaking

---

## 🏗️ Contract Architecture

Only the two contracts under `tokens/` currently exist. The remaining entries are roadmap components.

```
contracts/
├── tokens/
│   ├── SpaceMoney.sol          # ERC20 economic token
│   └── SpaceTime.sol           # Non-transferable governance token
├── governance/                 # Roadmap: not implemented
│   ├── ProposalManager.sol
│   ├── VotingEngine.sol
│   └── FounderVeto.sol
├── staking/                    # Roadmap: not implemented
│   ├── SMStaking.sol
│   └── STCapValidator.sol
└── treasury/                   # Roadmap: not implemented
    └── Treasury.sol
```

---

## 🚀 Development

### Prerequisites
- Node.js 20-22
- npm

### Setup
```bash
npm install
```

### Test
```bash
npm test
npm run test:coverage
```

### Deploy
```bash
# Testnet
npm run deploy:testnet

# Mainnet (requires verification)
npm run deploy:mainnet
```

---

## 🔒 Security

- [x] OpenZeppelin base contracts
- [x] Tests for the current token behavior
- [ ] External audit before mainnet deployment
- [ ] Testnet deployment & community testing
- [ ] Bug bounty program

---

## 📄 License

MIT License - Open source for the community

---

## 🔗 Related Projects

- [Athena Frontend](https://github.com/starspacegroup/athena-frontend-sveltekit) - Governance UI
- [Ammoura](https://github.com/starspacegroup/hermes) - First incubator project
- [Nabu](https://github.com/starspacegroup/nabu) - Marketing automation

---

**Built with ❤️ by the *Space community**
