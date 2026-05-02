const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HarambeeCoinModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", 1000000);
  const harambeeCoin = m.contract("HarambeeCoin", [initialSupply]);
  return { harambeeCoin };
});
