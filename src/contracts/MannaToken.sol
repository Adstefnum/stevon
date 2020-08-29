pragma solidity ^0.5.0;

//My ERC-20 Token
contract MannaToken {
	
	string public name = "MAAN Token";
	string public symbol = "MAAN";
	uint256 public totalSupply = 1000000000000000000000000;
	uint8   public decimals = 18;

	//These are the things that happen on the blockchain
	//the functions are just a way of calling these events 
	//on an updated(increased or reduced) account balance
	event Transfer(
        address indexed from,
        address indexed to,
        uint256 tokens
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 tokens
    );

    //these are dictionaries containing the balance and allowances
    //(those authorized to withdraw from an acct)=> they have a balance
    //inside it> allowances = { acct_address:{external_withdrawer_address:bal_withdraw}}
    //of a particular client using their address as the key
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    //this is an init method to get balance of current user based on their address
      constructor() public {
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 tokens) public returns (bool success) {
    	//checks if the client has as much as they want to transfer
        require(balances[msg.sender] >= tokens);

        //then remove the amount to be transferred from balance
        balances[msg.sender] -= tokens;

        //it updates the balance of the  account to receive the funds
        balances[to] += tokens;

        //This is the actual transfer and it returns True once done
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    function approve(address _spender, uint256 tokens) public returns (bool success) {
        allowances[msg.sender][_spender] = tokens;
        emit Approval(msg.sender, _spender, tokens);
        return true;
    }



	function transferFrom(address from, address to, uint256 tokens) public returns (bool success) {
		//this checks if the amt to be sent is less than acct bal
        require(tokens <= balances[from]);
        //this checks is amt to be sent is less or equal to thr
        //balance that the receiver can withdraw
        require(tokens <= allowances[from][msg.sender]);
        //they update the sender, receiver and receiver_allowance accts with tokens 
        balances[from] -= tokens;
        balances[to] += tokens;
        allowances[from][msg.sender] -= tokens;
        //actual transfer
        emit Transfer(from, to, tokens);
        return true;
    }
	
}