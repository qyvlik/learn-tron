require('dotenv').config({path: __dirname + '/.env'});

const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
// 这个私钥是 https://developers.tron.network/ 文档中的
// 地址 TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL 的私钥在互联网上是公开的
const privateKey = process.env['PRI_KEY'];
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

// https://developers.tron.network/reference#triggersmartcontract
// 调用智能合约
(async () => {
    const options = {
        feeLimit: 100000000,    // The maximum SUN consumes by deploying this contract. (1TRX = 1,000,000SUN)
        callValue: 0,           // Amount of SUN transferred to the contract with this transaction. (1TRX = 1,000,000 SUN)
        // tokenValue: 10,         // Amount of token sent with the call.
        // tokenId: 1000001        // If the function accepts a trc 10 token , then the id of the same
    };
    const contractAddress = tronWeb.address.toHex('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');
    const functions = 'transfer(address,uint256)';
    const issuerAddress = tronWeb.address.toHex('TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL');
    const parameter = [{type: 'address', value: 'YOUR_ADDRESS'}, {type: 'uint256', value: 100}];
    // console.info(`${JSON.stringify({contractAddress, functions, issuerAddress, parameter})}`);
    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddress,
        functions,
        options,
        parameter,
        issuerAddress);
    // console.info(`transaction:${JSON.stringify(transaction)}`);

    const signedTxn = await tronWeb.trx.multiSign(transaction.transaction, privateKey, 0);
    // console.info(`signedTxn: ${JSON.stringify(signedTxn)}`);

    const tx = await tronWeb.trx.sendRawTransaction(signedTxn);
    console.info(`${JSON.stringify(tx)}`);
})();

