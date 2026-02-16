// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SpaceTime
 * @dev Governance token for *Space DAO
 * - Earned only (never purchasable)
 * - Non-transferable (soulbound)
 * - Required to unlock SM staking capacity
 * - Decays over time (requires ongoing participation)
 */
contract SpaceTime is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    // Decay parameters (TBD - placeholder values)
    uint256 public constant DECAY_RATE = 1; // % per year
    mapping(address => uint256) public lastDecayTimestamp;
    
    constructor() ERC20("SpaceTime", "ST") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint ST tokens to a recipient (called by governance/task completion)
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
        lastDecayTimestamp[to] = block.timestamp;
    }
    
    /**
     * @dev Burn ST tokens (called by decay mechanism or governance)
     */
    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }
    
    /**
     * @dev Override transfer to make non-transferable (soulbound)
     */
    function transfer(address, uint256) public pure override returns (bool) {
        revert("ST is non-transferable");
    }
    
    /**
     * @dev Override transferFrom to make non-transferable
     */
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("ST is non-transferable");
    }
    
    /**
     * @dev Get effective balance after decay calculation
     * TODO: Implement decay logic
     */
    function effectiveBalance(address account) public view returns (uint256) {
        // Placeholder - implement time-based decay
        return balanceOf(account);
    }
}
