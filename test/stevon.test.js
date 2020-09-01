const Stevon = artifacts.require("Stevon")
const MannaToken = artifacts.require("MannaToken")
const DaiToken = artifacts.require("DaiToken")

require('chai')
.use(require('chai-as-promised'))
.should()

//helper function to convert to wei
function tokens_toWei(tokens){
	return web3.utils.toWei(tokens,'ether')
}
contract('Stevon',([owner,investor]) => {
	let daiToken,mannaToken,stevon

	before( async () => {
		daiToken = await DaiToken.new()
		mannaToken = await MannaToken.new()
		stevon = await Stevon.new(mannaToken.address,daiToken.address)

		//transfer 1 mil MANN to
		await mannaToken.transfer(stevon.address,tokens_toWei('1000000'))

		//to investor
		await daiToken.transfer(investor,tokens_toWei('100'),{from:owner})
	})

	describe('Mock DAI deployment', async ()=> {
		it('has a name', async () => {
			const name  = await daiToken.name()
			assert.equal(name, 'Mock DAI Token')
		})
	})

	describe('Manna deployment', async ()=> {
		it('has a name', async () => {
			const name  = await mannaToken.name()
			assert.equal(name, 'MAAN Token')
		})
	})

	describe('Stevon deployment', async ()=> {
		it('has a name', async () => {
			const name  = await stevon.name()
			assert.equal(name, 'MAAN Token Farm')
		})
		//check manna balance
		it('contract has tokens', async () => {
			const bal  = await mannaToken.balances(stevon.address)
			assert.equal(bal.toString(), tokens_toWei('1000000'))
		})
	})
	
	//check Dai balance before staking
	describe('Farming tokens', async () => {
		it('rewards investors for staking', async () => {
			let result
			

			 result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(),tokens_toWei('100'),'correct balance before staking')

			//stake tokens
			await daiToken.approve(stevon.address,tokens_toWei('100'),{from:investor})
			await stevon.stakeTokens(tokens_toWei('100'),{from:investor})

			//checking bal after staking
			//investor
			 result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(),tokens_toWei('0'),'correct investor balance after staking')

			//farm
			 result = await daiToken.balanceOf(stevon.address)
			assert.equal(result.toString(),tokens_toWei('100'),'correct farm balance after staking')


			 result = await stevon.stakingBalance(investor)
			assert.equal(result.toString(),tokens_toWei('100'),'correct investor balance after staking')

			 result = await stevon.isStaking(investor)
			assert.equal(result.toString(),'true','correct investor status after staking')

			await stevon.issueTokens({from:owner})
			result= await mannaToken.balances(investor)
			assert.equal(result.toString(),tokens_toWei('100'),'correct owner balance after staking')

			await stevon.issueTokens({from:owner}).should.be.rejected

			result= await daiToken.balanceOf(investor)
			assert.equal(result.toString(),tokens_toWei('100'),'correct Mock DAI balance after staking')

			result= await daiToken.balanceOf(stevon.address)
			assert.equal(result.toString(),tokens_toWei('0'),'correct owner balance after staking')

			result= await stevon.stakingBalance(investor)
			assert.equal(result.toString(),tokens_toWei('0'),'investor staking bal after staking')

			
		})
	})

	
})
