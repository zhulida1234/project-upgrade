const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  const CrowdfundingPlatform = await ethers.getContractFactory("CrowdfundingPlatform");

  const initialOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const platform = await upgrades.deployProxy(CrowdfundingPlatform, [initialOwner], { initializer: "initialize" });

  await platform.waitForDeployment();
  const proxyAddress = platform.target;
  console.log("CrowdfundingPlatform deployed to:", platform.target);

  fs.writeFileSync("proxyAddress.txt", proxyAddress);
}

main();