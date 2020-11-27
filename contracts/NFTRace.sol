pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract TokenizeNFT is Ownable {
    using SafeMath for uint256;

    uint256 public currentRace = 0;
    uint256 constant public maxParticipant = 10;
    uint256 public minParticipant = 2;

    struct Participant {
        address nftCntract;
        uint256 nftId;
        uint256 score;
    }

    mapping(uint256 => Participant) public raceParticipants;
    mapping(uint256 => uint256) public raceMaxScore;
    uint256 public entryPrice = 1 ether / 10; //0.1 eth

    constructor(
       
    ) public {

    }

    function getRace(uint256 raceNumber) public view returns(uint256 _raceNumber)
    {
        _raceNumber = raceNumber;

    }

   
}