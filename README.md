# Token generator example with time lock
It is simple example of ERC20 token generation with time lock. It allows you to obtain 1 token 1 time per 20 minutes. It consists of 2 parts:

1.Smart contract based on openzeppeling library:
```
contracts/SimpleERC20TokenWithTimeLock.sol
```
2.Web UI based on React:
```
/client
```
# How to use it
You will require to install the MetaMask extenstion in your browser. Then run the following commands in a terminal:
```
git clone git@github.com:ArtemVoronov/token-generator.git
cd token-generator/client
npm install
npm start
```
