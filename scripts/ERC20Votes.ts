import { viem } from 'hardhat';
import { parseEther, formatEther } from 'viem';

const MINT_VALUE = parseEther('1000');

async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, acc1, acc2] = await viem.getWalletClients();
    const contract = await viem.deployContract('MyToken');
    console.log(`Token contract deployed at ${contract.address}\n`);
    const mintTx = await contract.write.mint([
        acc1.account.address,
        MINT_VALUE,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(
        `Minted ${formatEther(MINT_VALUE)} decimal units to account ${
            acc1.account.address
        }\n`
    );
    const balanceBN = await contract.read.balanceOf([acc1.account.address]);
    console.log(
        `Account ${acc1.account.address} has ${formatEther(
            balanceBN
        )} decimal units of MyToken\n`
    );
    const votes = await contract.read.getVotes([acc1.account.address]);
    console.log(
        `Account ${acc1.account.address} has ${formatEther(
            votes
        )} units of voting power before self delegating\n`
    );
    const delegateTx = await contract.write.delegate([acc1.account.address], {
        account: acc1.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    const votesAfter = await contract.read.getVotes([acc1.account.address]);
    console.log(
        `Account ${acc1.account.address} has ${formatEther(
            votesAfter
        )} units of voting power after self delegating\n`
    );

    const transferTx = await contract.write.transfer(
        [acc2.account.address, MINT_VALUE / 3n],
        {
            account: acc1.account,
        }
    );
    await publicClient.waitForTransactionReceipt({ hash: transferTx });
    const votes1AfterTransfer = await contract.read.getVotes([
        acc1.account.address,
    ]);
    console.log(
        `Account ${acc1.account.address} has ${formatEther(
            votes1AfterTransfer
        )} units of voting power after transferring\n`
    );
    const votes2AfterTransfer = await contract.read.getVotes([
        acc2.account.address,
    ]);
    console.log(
        `Account ${acc2.account.address} has ${formatEther(
            votes2AfterTransfer
        )} units of voting power after receiving a transfer\n`
    );
    const lastBlockNumber = await publicClient.getBlockNumber();
    for (let index = lastBlockNumber - 1n; index > 0n; index--) {
        const pastVotes = await contract.read.getPastVotes([
            acc1.account.address,
            index,
        ]);
        console.log(
            `Account ${acc1.account.address} had ${formatEther(
                pastVotes
            )} units of voting power at block ${index}\n`
        );
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
