pragma solidity ^0.4.17;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Pool is Ownable {
	string public name;
	string public author;
  	uint256 public deployed_time;

	function Pool(string _name, string _author) public {
		name = _name;
		author = _author;
		deployed_time = now;
		//https://dappsforbeginners.wordpress.com/tutorials/interactions-between-contracts/
		owner = tx.origin;
	}
}