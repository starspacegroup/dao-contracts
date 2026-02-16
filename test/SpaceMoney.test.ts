import { expect } from "chai";
import { ethers } from "hardhat";
import { SpaceMoney } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SpaceMoney", function () {
  let spaceMoney: SpaceMoney;
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    
    const SpaceMoneyFactory = await ethers.getContractFactory("SpaceMoney");
    spaceMoney = await SpaceMoneyFactory.deploy();
    await spaceMoney.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await spaceMoney.name()).to.equal("SpaceMoney");
      expect(await spaceMoney.symbol()).to.equal("SM");
    });

    it("Should mint max supply to owner", async function () {
      const maxSupply = await spaceMoney.MAX_SUPPLY();
      const ownerBalance = await spaceMoney.balanceOf(owner.address);
      expect(ownerBalance).to.equal(maxSupply);
    });

    it("Should set the right owner", async function () {
      expect(await spaceMoney.owner()).to.equal(owner.address);
    });

    it("Should have 18 decimals", async function () {
      expect(await spaceMoney.decimals()).to.equal(18);
    });

    it("Should have correct max supply (1 billion)", async function () {
      const maxSupply = await spaceMoney.MAX_SUPPLY();
      const expectedSupply = ethers.parseUnits("1000000000", 18); // 1 billion
      expect(maxSupply).to.equal(expectedSupply);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      // Transfer from owner to alice
      await spaceMoney.transfer(alice.address, amount);
      expect(await spaceMoney.balanceOf(alice.address)).to.equal(amount);

      // Transfer from alice to bob
      await spaceMoney.connect(alice).transfer(bob.address, amount);
      expect(await spaceMoney.balanceOf(bob.address)).to.equal(amount);
      expect(await spaceMoney.balanceOf(alice.address)).to.equal(0);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const amount = ethers.parseUnits("1", 18);
      await expect(
        spaceMoney.connect(alice).transfer(bob.address, amount)
      ).to.be.reverted;
    });

    it("Should emit Transfer event", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await expect(spaceMoney.transfer(alice.address, amount))
        .to.emit(spaceMoney, "Transfer")
        .withArgs(owner.address, alice.address, amount);
    });
  });

  describe("Allowances", function () {
    it("Should approve and transferFrom tokens", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      // Owner approves alice to spend tokens
      await spaceMoney.approve(alice.address, amount);
      expect(await spaceMoney.allowance(owner.address, alice.address)).to.equal(amount);

      // Alice transfers from owner to bob
      await spaceMoney.connect(alice).transferFrom(owner.address, bob.address, amount);
      expect(await spaceMoney.balanceOf(bob.address)).to.equal(amount);
    });

    it("Should emit Approval event", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await expect(spaceMoney.approve(alice.address, amount))
        .to.emit(spaceMoney, "Approval")
        .withArgs(owner.address, alice.address, amount);
    });

    it("Should fail transferFrom without approval", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await expect(
        spaceMoney.connect(alice).transferFrom(owner.address, bob.address, amount)
      ).to.be.reverted;
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their own tokens", async function () {
      const transferAmount = ethers.parseUnits("1000", 18);
      const burnAmount = ethers.parseUnits("500", 18);
      
      // Give alice some tokens
      await spaceMoney.transfer(alice.address, transferAmount);
      
      // Alice burns tokens
      await spaceMoney.connect(alice).burn(burnAmount);
      
      expect(await spaceMoney.balanceOf(alice.address)).to.equal(transferAmount - burnAmount);
      
      // Total supply should decrease
      const maxSupply = await spaceMoney.MAX_SUPPLY();
      const totalSupply = await spaceMoney.totalSupply();
      expect(totalSupply).to.equal(maxSupply - burnAmount);
    });

    it("Should fail to burn more tokens than balance", async function () {
      const burnAmount = ethers.parseUnits("1", 18);
      await expect(
        spaceMoney.connect(alice).burn(burnAmount)
      ).to.be.reverted;
    });

    it("Should emit Transfer event to zero address on burn", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await expect(spaceMoney.burn(amount))
        .to.emit(spaceMoney, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, amount);
    });
  });

  describe("Ownership", function () {
    it("Should allow owner to transfer ownership", async function () {
      await spaceMoney.transferOwnership(alice.address);
      expect(await spaceMoney.owner()).to.equal(alice.address);
    });

    it("Should not allow non-owner to transfer ownership", async function () {
      await expect(
        spaceMoney.connect(alice).transferOwnership(bob.address)
      ).to.be.reverted;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount transfers", async function () {
      await expect(spaceMoney.transfer(alice.address, 0)).to.not.be.reverted;
    });

    it("Should handle transfers to self", async function () {
      const amount = ethers.parseUnits("1000", 18);
      const initialBalance = await spaceMoney.balanceOf(owner.address);
      await spaceMoney.transfer(owner.address, amount);
      expect(await spaceMoney.balanceOf(owner.address)).to.equal(initialBalance);
    });

    it("Should not allow transfer to zero address", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await expect(
        spaceMoney.transfer(ethers.ZeroAddress, amount)
      ).to.be.reverted;
    });
  });
});
