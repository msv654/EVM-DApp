    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

contract contractExample {
    string private text;
    address public owner;


    constructor() {
        text = "text example";
        owner = msg.sender;
    }

    function funExample() public view returns (string memory) {
        return text;
    }

    function setText(string calldata newText) public onlyOwner {
        text = newText;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    modifier onlyOwner()
    {
        require (msg.sender == owner, "Caller is not the owner");
        _;
    }
}