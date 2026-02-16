import { ethers } from "hardhat";

async function main() {
  console.log("Deploying *Space DAO contracts...");

  // Deploy SpaceMoney
  const SpaceMoney = await ethers.getContractFactory("SpaceMoney");
  const spaceMoney = await SpaceMoney.deploy();
  await spaceMoney.waitForDeployment();
  console.log("SpaceMoney deployed to:", await spaceMoney.getAddress());

  // Deploy SpaceTime
  const SpaceTime = await ethers.getContractFactory("SpaceTime");
  const spaceTime = await SpaceTime.deploy();
  await spaceTime.waitForDeployment();
  console.log("SpaceTime deployed to:", await spaceTime.getAddress());

  // TODO: Deploy governance contracts
  // TODO: Deploy staking contracts
  // TODO: Deploy treasury

  console.log("\n✅ Deployment complete!");
  console.log("\nNext steps:");
  console.log("1. Verify contracts on PolygonScan");
  console.log("2. Update Athena frontend with contract addresses");
  console.log("3. Set up multi-sig for treasury");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
