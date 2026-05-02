const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HarambeeCoin", function () {
  let harambeeCoin;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const HarambeeCoin = await ethers.getContractFactory("HarambeeCoin");
    harambeeCoin = await HarambeeCoin.deploy(1000000);
  });

  it("Should set the right name and symbol", async function () {
    expect(await harambeeCoin.name()).to.equal("HarambeeCoin");
    expect(await harambeeCoin.symbol()).to.equal("HBC");
  });

  it("Should assign total supply to owner", async function () {
    const ownerBalance = await harambeeCoin.balanceOf(owner.address);
    expect(await harambeeCoin.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    await harambeeCoin.transfer(addr1.address, 1000);
    expect(await harambeeCoin.balanceOf(addr1.address)).to.equal(1000);
  });

  it("Should fail if sender has insufficient balance", async function () {
    await expect(
      harambeeCoin.connect(addr1).transfer(addr2.address, 1000)
    ).to.be.revertedWith("Insufficient balance");
  });

  it("Should allow owner to mint tokens", async function () {
    await harambeeCoin.mint(addr1.address, 5000);
    expect(await harambeeCoin.balanceOf(addr1.address)).to.equal(5000);
  });

  it("Should allow users to burn tokens", async function () {
    await harambeeCoin.transfer(addr1.address, 5000);
    await harambeeCoin.connect(addr1).burn(2000);
    expect(await harambeeCoin.balanceOf(addr1.address)).to.equal(3000);
  });
});
