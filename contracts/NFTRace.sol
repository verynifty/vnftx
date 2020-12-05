pragma solidity ^0.6.0;

pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTRace is Ownable {
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
    uint256 public entryPrice;
    uint256 public raceDuration;
    uint256 public devPercent;
    address public devAddress;

    mapping(bytes32 => bool) public tokenParticipants;

    address payable raceMaster = address(0);

    event raceEnded(uint256 currentRace, uint256 prize, address winner);
    event participantEntered(uint256 currentRace, uint256 bet, address who, address tokenAddress, uint256 tokenId);

    constructor() public {}

    function setRaceParameters(
        uint256 _entryPrice,
        uint256 _raceDuration,
        address _devAddress,
        uint256 _devPercent
    ) public onlyOwner {
        entryPrice = _entryPrice;
        raceDuration = _raceDuration;
        devAddress = _devAddress;
        devPercent = _devPercent;
        raceStart[currentRace] = now;
    }

    function settleRaceIfPossible() public {
        if (
            raceStart[currentRace] + raceDuration >= now ||
            raceParticipants[currentRace] >= maxParticipants
        ) {
            uint256 maxScore = 0;
            address payable winner = address(0);
            // logic to distribute prize
            for (uint256 i; i < participants[currentRace].length; i++) {
                participants[currentRace][i].score = randomNumber(i, 100)
                    .mul(
                    99 + whitelist[participants[currentRace][i].nftContract]
                )
                    .div(100); // Need to check this one more
                if (participants[currentRace][i].score > maxScore) {
                    winner = participants[currentRace][i].add;
                    maxScore = participants[currentRace][i].score;
                }
            }
             emit raceEnded(
                currentRace,
                participants[currentRace].length.mul(entryPrice).mul(95).div(
                    100
                ),
                winner
            );
            currentRace = currentRace.add(1);
            raceStart[currentRace] = now;
            winner.transfer(
                participants[currentRace].length.mul(entryPrice).mul(95).div(
                    100
                )
            ); //Check reentrency
            raceMaster.transfer(
                participants[currentRace].length.mul(entryPrice).mul(5).div(100)
            );
            //Emit race won event
           
        }
    }

    function getParticipantId(
        address _tokenAddress,
        uint256 _tokenId,
        uint256 _tokenType,
        uint256 _raceNumber
    ) public pure returns (bytes32) {
        return (
            keccak256(abi.encodePacked(_tokenAddress, _tokenId, _tokenType, _raceNumber))
        );
    }

    function joinRace(
        address _tokenAddress,
        uint256 _tokenId,
        uint256 _tokenType
    ) public payable {
        require(msg.value == entryPrice, "Not enough ETH to participate");
        require(tokenParticipants[getParticipantId(_tokenAddress, _tokenId, _tokenType, currentRace)] == false, "This NFT is already registered for the race");
        if (_tokenType == 725) {
            require(
                IERC721(_tokenAddress).ownerOf(_tokenId) == msg.sender,
                "You don't own the NFT"
            );
        } else if (_tokenType == 1155) {
            require(
                IERC1155(_tokenAddress).balanceOf(msg.sender, _tokenId) > 0,
                "You don't own the NFT"
            );
        }
        participants[currentRace].push(
            Participant(_tokenAddress, _tokenId, 0, msg.sender)
        );
        emit participantEntered(currentRace, entryPrice, msg.sender, _tokenAddress, _tokenId);
        settleRaceIfPossible(); // this will launch the previous race if possible
    }

    function getRaceInfo(uint256 raceNumber)
        public
        view
        returns (
            uint256 _raceNumber,
            uint256 _participantsCount,
            Participant[maxParticipants] memory _participants
        )
    {
        _raceNumber = raceNumber;
        _participantsCount = participants[raceNumber].length;
        for (uint256 i; i < participants[raceNumber].length; i++) {
            _participants[i] = participants[raceNumber][i];
        }
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

    function max(uint256 a, uint256 b) private pure returns (uint256) {
        return a > b ? a : b;
    }
}
