const Stevon = artifacts.require("Stevon")

module.exports = async function(callback) {

  let stevon = await Stevon.deployed()
  await stevon.issueTokens()

  console.log('Tokens issued')
  callback()

}