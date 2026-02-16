// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SpaceMoney
 * @dev Economic token for *Space DAO
 * - Buyable and transferable
 * - Used to fund proposals
 * - Stakeable for increased voting power (capped by ST balance)
 * - Revenue share mechanism
 */
contract SpaceMoney is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    constructor() ERC20("SpaceMoney", "SM") Ownable(msg.sender) {
        // Initial supply minted to treasury (will be deployed separately)
        _mint(msg.sender, MAX_SUPPLY);
    }
    
    /**
     * @dev Burn tokens (for future use cases like dev credits)
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
