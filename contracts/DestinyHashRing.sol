// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*
 * @dev J
 * Fate undercontrolled in Luck of Our Hands, Only.
 */
contract DestinyHashRing {
    uint256 public constant ROUND_COUNT = 16;
    uint256 public constant ROUND_FEE = 3;
    uint256 public constant INVITE_SHARE = 10;

    uint256 public betCost;
    uint256 public currentRound;
    bool public roundSettling = false;
    address public devTreater;

    mapping(uint256 => address[]) public roundParticipants;
    mapping(uint256 => address[]) public roundWinner;
    mapping(uint256 => uint256) public roundPrize;
    mapping(uint256 => mapping(address => bool)) public roundPartVerifyer;
    mapping(uint256 => mapping(address => address)) public roundPartInviter;

    event RoundJoin(uint256 indexed round, address indexed user, address indexed inviter, uint256 seq);
    event RoundWinner(uint256 indexed round, uint256 count, address[] users);

    modifier isSettling() {
        require(!roundSettling, "Forbid join while settling");
        _;
    }

    constructor(uint256 _betCost, address _devTreater) {
        require(_betCost > 0 && _devTreater != address(0));
        betCost = _betCost;
        devTreater = _devTreater;
    }

    function enjoy(address _inviter) payable external isSettling {
        require(msg.value == betCost, "Invalid Bet Value.");
        require(_canPart(), "Had joined or settling.");

        roundParticipants[currentRound].push(msg.sender);
        roundPartVerifyer[currentRound][msg.sender] = true;
        roundPrize[currentRound] += msg.value;
        if(_inviter != address(0)) {
            uint256 size;
            assembly { size := extcodesize(_inviter) }
            if(size == 0) {
                roundPartInviter[currentRound][msg.sender] = _inviter;    // ensure it's a EOA
            }
        }

        _pickWinner();

        emit RoundJoin(currentRound, msg.sender, _inviter, roundParticipants[currentRound].length);
    }

    function _canPart() internal view returns(bool) {
        return !roundPartVerifyer[currentRound][msg.sender] && roundParticipants[currentRound].length <= ROUND_COUNT - 1;
    }

    function _pickWinner() internal {
        if(roundParticipants[currentRound].length == ROUND_COUNT) {
            roundSettling = true;
            uint256 comw = uint256(keccak256(
                abi.encodePacked(currentRound, block.timestamp, blockhash(block.number - 1))
            )) % ROUND_COUNT;
            
            address[] memory winners = new address[](ROUND_COUNT);
            uint256 winnerCount = 0;

            for(uint256 i=0; i < roundParticipants[currentRound].length; i++) {
                if(uint8(comw) == uint8(uint160(roundParticipants[currentRound][i]))) {
                    winnerCount++;
                    winners[i] = roundParticipants[currentRound][i];
                }
                delete roundPartVerifyer[currentRound][roundParticipants[currentRound][i]];
            }
            delete roundParticipants[currentRound];
            _distributePrize(winnerCount, winners);            
            currentRound++;
            roundSettling = false;
        }
    }

    function _distributePrize(uint256 _count, address[] memory _winners) private {
        uint256 winnerPrize = roundPrize[currentRound];
        if(devTreater != address(0)) {
            payable(devTreater).transfer( winnerPrize * ROUND_FEE / 100);
            winnerPrize = winnerPrize * (100 - ROUND_FEE) / 100;
        }
        if(_count==0) {
            roundPrize[currentRound] = 0;
            roundPrize[currentRound + 1] += winnerPrize;
        } else {
            uint256 eachPrize = winnerPrize / _count;
            for(uint256 i=0; i < _winners.length; i++) {
                if(_winners[i] != address(0)) {
                    roundWinner[currentRound].push(_winners[i]);
                    uint256 _sharePrize = 0;
                    if(roundPartInviter[currentRound][_winners[i]] != address(0)) {
                        _sharePrize = eachPrize / INVITE_SHARE;
                        payable(roundPartInviter[currentRound][_winners[i]]).transfer(_sharePrize);
                    }
                    // payable(_winners[i]).transfer(eachPrize - _sharePrize);
                    bool transVal = _secTransfer(_winners[i], eachPrize - _sharePrize);
                    if(!transVal) {
                        roundPrize[currentRound + 1] += (eachPrize - _sharePrize);  //to cumulate prize to next round when bad contract 
                    }
                }
            }
            emit RoundWinner(currentRound, _count, _winners);
        }
    }

    function _secTransfer(address target, uint256 amount) private returns(bool) {
        (bool result,) = payable(target).call{value: amount, gas: 50_000}("");
        return result;
    }


    receive() payable external {
        if(currentRound > 0) {
            roundPrize[currentRound] += msg.value;
        }
    }
    
}