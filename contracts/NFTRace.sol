pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract TokenizeNFT is Ownable {
    using SafeMath for uint256;

    uint256 public currentRace = 0;
    uint256 public constant maxParticipants = 10;
    uint256 public minParticipant = 2;

    struct Participant {
        address nftContract;
        uint256 nftId;
        uint256 score;
        address payable add;
    }

    mapping(uint256 => Participant[]) public participants;
    mapping(uint256 => uint256) public raceParticipants;
    mapping(uint256 => uint256) public raceMaxScore;
    mapping(uint256 => uint256) public raceStart;
    mapping(address => uint256) public whitelist;
    uint256 public entryPrice = 1 ether / 10; //0.1 eth
    uint256 public raceDuration = 2 * 1 hours;

    address payable raceMaster = address(0);

    constructor() public {}

    function settleRaceIfPossible() public {
        if (
            raceStart[currentRace] + raceDuration < now ||
            raceParticipants[currentRace] >= maxParticipants
        ) {
            uint256 maxScore = 0;
            address payable winner = address(0);
            // logic to distribute prize
            for (uint256 i; i < participants[currentRace].length; i++) {
                participants[currentRace][i].score = randomNumber(i, 100).mul(99 + whitelist[participants[currentRace][i].nftContract]).div(100);
                if (participants[currentRace][i].score > maxScore) {
                    winner = participants[currentRace][i].add;
                    maxScore = participants[currentRace][i].score;
                }
            }
            currentRace = currentRace.add(1);
            winner.transfer(participants[currentRace].length.mul(entryPrice).mul(95).div(100)); //Check reentrency
            raceMaster.transfer(participants[currentRace].length.mul(entryPrice).mul(5).div(100));
            //Emit race won event
        }
    }

    function joinRace(address _tokenAddress, uint256 _tokenId) public payable {
        require(msg.value > entryPrice, "Not enough ETH to participate");
        require(whitelist[_tokenAddress] > 0, "This NFT is not whitelisted");
        //Check if owner of nft
        // check if nft is not already registered
        
        participants[currentRace].push(Participant(_tokenAddress, _tokenId, 0, msg.sender));
        settleRaceIfPossible(); // this will launch the previous race if possible
    }

    function getRace(uint256 raceNumber)
        public
        view
        returns (uint256 _raceNumber)
    {
        _raceNumber = raceNumber;
    }

    /* generates a number from 0 to 2^n based on the last n blocks */
    function randomNumber(uint256 seed, uint256 max)
        public
        view
        returns (uint256 _randomNumber)
    {
        uint256 n = 0;
        for (uint256 i = 0; i < 2; i++) {
            if (
                uint256(
                    keccak256(
                        abi.encodePacked(blockhash(block.number - i - 1), seed)
                    )
                ) %
                    2 ==
                0
            ) n += 2**i;
        }
        return n % max;
    }

    function max(uint a, uint b) private pure returns (uint) {
        return a > b ? a : b;
    }
}
