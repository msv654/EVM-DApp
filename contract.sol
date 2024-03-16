// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract contractExample {

string private text;


constructor () {
    text = "text example";
}

function functionExample() public view returns (string memory){
    return text;
}

function setText(string memory newText) public{
    text = newText;
}

}