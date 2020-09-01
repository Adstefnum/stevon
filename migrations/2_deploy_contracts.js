const Stevon = artifacts.require("Stevon")
const MannaToken = artifacts.require("MannaToken")
const DaiToken = artifacts.require("DaiToken")

module.exports = async function(deployer,networks,accounts) {

 await deployer.deploy(MannaToken)
 const mannaToken = await MannaToken.deployed()

 await  deployer.deploy(DaiToken)
 const daiToken = await DaiToken.deployed()

  await deployer.deploy(Stevon,mannaToken.address,daiToken.address)
  const stevon = await Stevon.deployed()

  //transfer all tokens to stevon(1 mil)
  await mannaToken.transfer(stevon.address,'1000000000000000000000000')

  //transfer 100 DAI to investor
  await daiToken.transfer(accounts[1],'100000000000000000000')
}
