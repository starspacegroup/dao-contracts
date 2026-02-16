import { expect } from "chai";
import { ethers } from "hardhat";
import { SpaceTime } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SpaceTime", function () {
  let spaceTime: SpaceTime;
  let owner: SignerWithAddress;
  let minter: SignerWithAddress;
  let burner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;

  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const BURNER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));
  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;

  beforeEach(async function () {
    [owner, minter, burner, alice, bob] = await ethers.getSigners();
    
    const SpaceTimeFactory = await ethers.getContractFactory("SpaceTime");
    spaceTime = await SpaceTimeFactory.deploy();
    await spaceTime.waitForDeployment();

    // Grant roles for testing
    await spaceTime.grantRole(MINTER_ROLE, minter.address);
    await spaceTime.grantRole(BURNER_ROLE, burner.address);
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await spaceTime.name()).to.equal("SpaceTime");
      expect(await spaceTime.symbol()).to.equal("ST");
    });

    it("Should grant admin role to deployer", async function () {
      expect(await spaceTime.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should grant minter and burner roles to deployer initially", async function () {
      expect(await spaceTime.hasRole(MINTER_ROLE, owner.address)).to.be.true;
      expect(await spaceTime.hasRole(BURNER_ROLE, owner.address)).to.be.true;
    });

    it("Should have 18 decimals", async function () {
      expect(await spaceTime.decimals()).to.equal(18);
    });

    it("Should start with zero total supply", async function () {
      expect(await spaceTime.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint tokens", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await spaceTime.connect(minter).mint(alice.address, amount);
      expect(await spaceTime.balanceOf(alice.address)).to.equal(amount);
    });

    it("Should update lastDecayTimestamp on mint", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await spaceTime.connect(minter).mint(alice.address, amount);
      
      const timestamp = await spaceTime.lastDecayTimestamp(alice.address);
      expect(timestamp).to.be.greaterThan(0);
    });

    it("Should fail if non-minter tries to mint", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await expect(
        spaceTime.connect(alice).mint(bob.address, amount)
      ).to.be.reverted;
    });

    it("Should emit Transfer event on mint", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await expect(spaceTime.connect(minter).mint(alice.address, amount))
        .to.emit(spaceTime, "Transfer")
        .withArgs(ethers.ZeroAddress, alice.address, amount);
    });

    it("Should increase total supply on mint", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await spaceTime.connect(minter).mint(alice.address, amount);
      expect(await spaceTime.totalSupply()).to.equal(amount);
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Mint some tokens to alice first
      const amount = ethers.parseUnits("1000", 18);
      await spaceTime.connect(minter).mint(alice.address, amount);
    });

    it("Should allow burner to burn tokens", async function () {
      const burnAmount = ethers.parseUnits("500", 18);
      await spaceTime.connect(burner).burn(alice.address, burnAmount);
      expect(await spaceTime.balanceOf(alice.address)).to.equal(
        ethers.parseUnits("500", 18)
      );
    });

    it("Should fail if non-burner tries to burn", async function () {
      const burnAmount = ethers.parseUnits("500", 18);
      await expect(
        spaceTime.connect(alice).burn(alice.address, burnAmount)
      ).to.be.reverted;
    });

    it("Should emit Transfer event on burn", async function () {
      const burnAmount = ethers.parseUnits("500", 18);
      await expect(spaceTime.connect(burner).burn(alice.address, burnAmount))
        .to.emit(spaceTime, "Transfer")
        .withArgs(alice.address, ethers.ZeroAddress, burnAmount);
    });

    it("Should decrease total supply on burn", async function () {
      const burnAmount = ethers.parseUnits("500", 18);
      await spaceTime.connect(burner).burn(alice.address, burnAmount);
      expect(await spaceTime.totalSupply()).to.equal(
        ethers.parseUnits("500", 18)
      );
    });
  });

  describe("Non-Transferability (Soulbound)", function () {
    beforeEach(async function () {
      // Mint tokens to alice
      const amount = ethers.parseUnits("1000", 18);
      await spaceTime.connect(minter).mint(alice.address, amount);
    });

    it("Should revert on transfer", async function () {
      const amount = ethers.parseUnits("100", 18);
      await expect(
        spaceTime.connect(alice).transfer(bob.address, amount)
      ).to.be.revertedWith("ST is non-transferable");
    });

    it("Should revert on transferFrom", async function () {
      const amount = ethers.parseUnits("100", 18);
      
      // Even with approval, should fail
      await expect(
        spaceTime.connect(alice).approve(bob.address, amount)
      ).to.not.be.reverted;
      
      await expect(
        spaceTime.connect(bob).transferFrom(alice.address, bob.address, amount)
      ).to.be.revertedWith("ST is non-transferable");
    });

    it("Should not allow transfer to zero address", async function () {
      const amount = ethers.parseUnits("100", 18);
      await expect(
        spaceTime.connect(alice).transfer(ethers.ZeroAddress, amount)
      ).to.be.revertedWith("ST is non-transferable");
    });
  });

  describe("Decay Mechanism", function () {
    it("Should return effective balance (placeholder)", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await spaceTime.connect(minter).mint(alice.address, amount);
      
      // Currently returns balance without decay
      const effective = await spaceTime.effectiveBalance(alice.address);
      expect(effective).to.equal(amount);
    });

    // TODO: Add tests for actual decay logic when implemented
    it("Should track decay rate constant", async function () {
      expect(await spaceTime.DECAY_RATE()).to.equal(1);
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to grant minter role", async function () {
      await spaceTime.grantRole(MINTER_ROLE, alice.address);
      expect(await spaceTime.hasRole(MINTER_ROLE, alice.address)).to.be.true;
    });

    it("Should allow admin to revoke minter role", async function () {
      await spaceTime.revokeRole(MINTER_ROLE, minter.address);
      expect(await spaceTime.hasRole(MINTER_ROLE, minter.address)).to.be.false;
    });

    it("Should not allow non-admin to grant roles", async function () {
      await expect(
        spaceTime.connect(alice).grantRole(MINTER_ROLE, bob.address)
      ).to.be.reverted;
    });

    it("Should allow role renunciation", async function () {
      await spaceTime.connect(minter).renounceRole(MINTER_ROLE, minter.address);
      expect(await spaceTime.hasRole(MINTER_ROLE, minter.address)).to.be.false;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle minting zero tokens", async function () {
      await expect(
        spaceTime.connect(minter).mint(alice.address, 0)
      ).to.not.be.reverted;
    });

    it("Should not allow burning more than balance", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await spaceTime.connect(minter).mint(alice.address, amount);
      
      await expect(
        spaceTime.connect(burner).burn(alice.address, ethers.parseUnits("2000", 18))
      ).to.be.reverted;
    });

    it("Should handle multiple mints to same address", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await spaceTime.connect(minter).mint(alice.address, amount);
      await spaceTime.connect(minter).mint(alice.address, amount);
      
      expect(await spaceTime.balanceOf(alice.address)).to.equal(
        ethers.parseUnits("2000", 18)
      );
    });
  });
});
