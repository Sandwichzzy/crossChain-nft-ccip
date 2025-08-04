// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {MyToken} from "./MyToken.sol";

contract WrappedMyToken is MyToken {
    constructor(string memory tokenName, string memory tokenSymbol) MyToken(tokenName, tokenSymbol) {}
}