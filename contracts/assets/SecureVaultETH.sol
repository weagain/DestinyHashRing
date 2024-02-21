// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";

contract SecureVaultETH is ERC20("Secure Vault ETH", "svETH") {

    event  Deposit(address indexed dst, uint wad);
    event  Withdrawal(address indexed src, uint wad);

    fallback() external payable {
        deposit();
    }
    receive() external payable {}

    function deposit() public payable {
        // balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function totalSupply() public view override returns(uint) {
        return address(this).balance;
    }


}