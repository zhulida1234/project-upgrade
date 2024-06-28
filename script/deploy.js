const { ethers, upgrades } = require("hardhat");

async function main() {
  const CrowdfundingPlatform = await ethers.getContractFactory("CrowdfundingPlatform");

  const initialOwner = "0x702b4B92b74ac470d1eeb91106A2e7Be73F8b92b";
  const platform = await upgrades.deployProxy(CrowdfundingPlatform, [initialOwner], { initializer: "initialize" });

  await platform.waitForDeployment();
  console.log("CrowdfundingPlatform deployed to:", platform.target);
}

main();