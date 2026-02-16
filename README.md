# *Space DAO Contracts

Smart contracts for the *Space Wyoming DAO LLC - a decentralized organization with proportional governance and hardcoded sunset triggers.

---

## 🌟 Token System

**SpaceMoney (SM)** - Economic Token
- Buyable, transferable
- Revenue share, treasury share
- Stakeable for increased voting power (capped by ST balance)
- Used to fund proposals

**SpaceTime (ST)** - Governance Token
- Earned only (never purchasable)
- Non-transferable
- Required to unlock SM staking capacity
- Decays slowly (requires ongoing participation)

---

## 🗳️ Governance Model

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

```
contracts/
├── tokens/
│   ├── SpaceMoney.sol          # ERC20 economic token
│   └── SpaceTime.sol           # Non-transferable governance token
├── governance/
│   ├── ProposalManager.sol     # Create/execute proposals
│   ├── VotingEngine.sol        # Proportional voting logic
│   └── FounderVeto.sol         # Veto with sunset triggers
├── staking/
│   ├── SMStaking.sol           # SM staking with time-weighted multipliers
│   └── STCapValidator.sol      # ST balance validation for staking
└── treasury/
    └── Treasury.sol            # Multi-sig treasury management
```

---

## 🚀 Development

### Prerequisites
- Node.js 18+
- Hardhat or Foundry

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

- [ ] OpenZeppelin base contracts
- [ ] Comprehensive test coverage (>95%)
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
