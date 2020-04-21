pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract SimpleERC20Token is ERC20 {
  string public constant name = 'Simple Test Token';
  string public constant symbol = 'STT';
  uint8 public constant decimals = 2;
  uint constant _initial_supply = 10000;

  constructor() public {
    _mint(msg.sender, _initial_supply);
  }
}
