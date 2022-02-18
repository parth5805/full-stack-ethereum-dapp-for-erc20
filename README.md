# Full Stack Dapp For Accessing Function of ERC20 Token 

In this project I used React,Solidity,Hardhat,chai for testing.
I created ERC20 from Scratch without using any library.
I deploy this token on Ropsten Testnet for that I used alchemy.
I also performed ERC20 uint testing.
I made simple FrontEnd By using bootstrap.

# Prerequisite
First You need to install require dependencies
```shell
 npm install
```
Now,You need to create Alchemy account and select ropsten network.
Then open envtest file and copy Http Api key from alchemy and paste it inside API_URl.
Now open your mestamask and select one ropsten account and export private key and paste it inside PRIVATE_KEY in envtest.
Now replace this envtest file name to .env

Now Run this command 
```shell
npx hardhat compile
npx hardhat run scripts/deploy.js --network ropsten
```
Now copy Token address from console and paste it in App.js LineNo:7

Now Run this command for React App
```shell
npm start
```
open localhost:3000 on browser

