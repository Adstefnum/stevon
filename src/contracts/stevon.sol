pragma solidity ^0.5.0;

import './MannaToken.sol';
import './DaiToken.sol';
//The token Farm
contract Stevon {
	
	string public name = "MAAN Token Farm";
	address public owner;
	DaiToken public daitoken;
	MannaToken public manntoken;
	

	address[] public stakers;
	mapping(address => uint) public stakingBalance;
	mapping(address => bool)public hasStaked;
	mapping(address => bool)public isStaking;

	constructor(DaiToken _daitoken, MannaToken _manntoken) public{
		daitoken  = _daitoken;
		manntoken = _manntoken;
		owner = msg.sender;
	}
	//stake Tokens
	function stakeTokens(uint _amt) public  {
		//make sure they are putting more than zero
		require(_amt > 0, 'Your stake must be greater than 0');

		//transfer all Dai to this contract
		daitoken.transferFrom(msg.sender,address(this),_amt);

		//update Staking Bal
		stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amt;

		//add them to stakers list if they have not staked before(are not already in the list)
		if(!hasStaked[msg.sender]){
			stakers.push(msg.sender);
		}

		//Update staking status
		isStaking[msg.sender] = true;
		hasStaked[msg.sender] = true;
	}

	//issue tokens
	function issueTokens() public {
		require(msg.sender==owner,'Only admin can issue tokens');
		for(uint i; i<stakers.length; i++ ){
			address receiver = stakers[i];
			uint balance = stakingBalance[receiver];
			if(balance>0){
				manntoken.transfer(receiver,balance);
			}
		}
	}
	//unstake tokens
	function unstakeTokens() public {
		//get the amount that the person has in the app
		uint balance = stakingBalance[msg.sender];

		//make sure it's more than 0
		require(balance >0);

		//transfer to owner
		daitoken.transfer(msg.sender,balance);

		//update stacking blanace and status
		stakingBalance[msg.sender]  =0;
		isStaking[msg.sender] = false;


	}
	
}