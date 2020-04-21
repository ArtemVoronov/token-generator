pragma solidity ^0.5.0;

import "./SimpleERC20Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract SimpleERC20TokenWithTimeLock is SimpleERC20Token {
  using SafeMath for uint;
  uint256 lockTimeInMinutes;
  uint256 lastTokenGenerationDateTime;

  constructor() public {
    lockTimeInMinutes = 20; //then it could be changed in future
    lastTokenGenerationDateTime = now;
  }

  modifier timeLocked {
    require(now > lastTokenGenerationDateTime, "It is required to wait 20 minutes after last token generation event");
    _;
  }

  function updateTimeLock(uint _minutes) internal {
    lastTokenGenerationDateTime = now.add(_minutes * 1 minutes);
  }

  //just add time lock for direct token sending
  function transfer(address recipient, uint256 amount) public timeLocked returns (bool) {
    updateTimeLock(lockTimeInMinutes);
    return super.transfer(recipient, amount);
  }

  //and just add time lock for indirect token sending
  function transferFrom(address sender, address recipient, uint256 amount) public timeLocked returns (bool) {
    updateTimeLock(lockTimeInMinutes);
    return super.transferFrom(sender, recipient, amount);
  }
}
