import { viem } from 'hardhat';
import { parseEther, formatEther } from 'viem';

const MINT_VALUE = parseEther('1000');

async function main() {
    const publicClient = await viem.getPublicClient();

    // Address to which you want to check tokens
    const yourAddress = '0x73664123B9f7b75C528D4Ca757Ec82c6cf313331';

    // Address to which you want to transfer tokens
    const receiverAddress = '0x..';

    // Address of the deployed contract
    const contractAddress = '0xd4208ccc176c0a0b81c07a9c3b9e1b14a2ccfc82';

    // Connect to the existing contract
    const contract = await viem.getContractAt('MyToken', contractAddress);

    const transferTx = await contract.write.transfer(
        [receiverAddress, MINT_VALUE / 7n],
        {
            account: yourAddress,
        }
    );
    await publicClient.waitForTransactionReceipt({ hash: transferTx });
    const votes1AfterTransfer = await contract.read.getVotes([yourAddress]);
    console.log(
        `Account ${yourAddress} has ${formatEther(
            votes1AfterTransfer
        )} units of voting power after transferring\n`
    );
    const votes2AfterTransfer = await contract.read.getVotes([receiverAddress]);
    console.log(
        `Account ${receiverAddress} has ${formatEther(
            votes2AfterTransfer
        )} units of voting power after receiving a transfer\n`
    );
    const lastBlockNumber = await publicClient.getBlockNumber();
    for (let index = lastBlockNumber - 1n; index > 0n; index--) {
        const pastVotes = await contract.read.getPastVotes([
            yourAddress,
            index,
        ]);
        console.log(
            `Account ${yourAddress} had ${formatEther(
                pastVotes
            )} units of voting power at block ${index}\n`
        );
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
