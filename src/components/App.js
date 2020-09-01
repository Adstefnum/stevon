import React, { Component } from 'react'
import Navbar from './Navbar'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import MannaToken from '../abis/MannaToken.json'
import Stevon from '../abis/Stevon.json'
import './App.css'
import Main from './main.js'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadWeb3(){
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
     window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non eth browser detected. Please install metamask or any good eth wallet and try again.')
    }
  }

  async loadBlockChainData() {
    const web3 = window.web3

    const accounts= await web3.eth.getAccounts()
    this.setState({account:accounts[0]})

    const netId = await web3.eth.net.getId()

    //load daiToken
    const daiTokenData = DaiToken.networks[netId]
    if (daiTokenData){
      const daiToken  = new web3.eth.Contract(DaiToken.abi,daiTokenData.address)
      this.setState({daiToken})
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({daiTokenBalance: daiTokenBalance.toString()})}
      else{
        window.alert('DaiToken Contact not found')
      }

      const mannaTokenData = MannaToken.networks[netId]
    if (mannaTokenData){
      const mannaToken  = new web3.eth.Contract(MannaToken.abi,mannaTokenData.address)
      this.setState({mannaToken})
      let mannaTokenBalance = await mannaToken.methods.balances(this.state.account).call()
      this.setState({mannaTokenBalance: mannaTokenBalance.toString()})}
      else{
        window.alert('MannaToken Contact not found')
      }

      const stevonData = Stevon.networks[netId]
    if (stevonData){
      const stevon  = new web3.eth.Contract(Stevon.abi,stevonData.address)
      this.setState({stevon})
      let stevonBalance = await stevon.methods.stakingBalance(this.state.account).call()
      this.setState({stevonBalance: stevonBalance.toString()})}
      else{
        window.alert('Stevon Contact not found')
      }

      this.setState({loading:false})
    }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.stevon._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.stevon.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.stevon.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken : {},
      stevon : {},
      mannaToken : {},
      daiTokenBalance: '0',
      mannaTokenBalance: '0',
      stakingBalance: '0',
      loading:true,
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        daiTokenBalance={this.state.daiTokenBalance}
        dappTokenBalance={this.state.dappTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }
    return (
       <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://github.com/Adstefnum"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
