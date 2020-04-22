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
    require(now > lastTokenGenerationDateTime, "TIME_LOCK_ERROR: it is required to wait 20 minutes after last token generation event");
    _;
  }

  //create one token for sender
  function generateElseOneToken() public timeLocked {
    updateTimeLock(lockTimeInMinutes);
    _mint(msg.sender, 100);
  }

  function updateTimeLock(uint _minutes) internal {
    lastTokenGenerationDateTime = now.add(_minutes * 1 minutes);
  }

  function changeLockTime(uint _minutes) public onlyOwner { //for testing purposes
    lockTimeInMinutes = _minutes;
    lastTokenGenerationDateTime = now;
  }

  function getLastTokenGenerationDateTime() public view returns (uint) {
    return lastTokenGenerationDateTime;
  }
}
