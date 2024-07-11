// const { ethers, upgrades } = require("hardhat");

// async function main() {
//   const CrowdfundingPlatformV2 = await ethers.getContractFactory("CrowdfundingPlatformV2");
//   const platform = await upgrades.upgradeProxy("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", CrowdfundingPlatformV2);

//   console.log("CrowdfundingPlatform upgraded");
// }

// main();

const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with the account:", deployer.address);

  const proxyAddress = fs.readFileSync("proxyAddress.txt", "utf8").trim(); // 替换为你的实际代理地址
  
  const CrowdfundingPlatformV2 = await ethers.getContractFactory("CrowdfundingPlatformV2");
  console.log("Upgrading CrowdfundingPlatform...");

  const upgraded = await upgrades.upgradeProxy(proxyAddress, CrowdfundingPlatformV2);

  console.log("CrowdfundingPlatform upgraded to V2 at:", upgraded.target);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });