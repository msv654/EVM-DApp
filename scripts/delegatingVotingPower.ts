import { viem } from 'hardhat';
import { parseEther, formatEther } from 'viem';

async function main() {
    const publicClient = await viem.getPublicClient();

    // Address to which you want to check tokens
    const yourAddress = '0x73664123B9f7b75C528D4Ca757Ec82c6cf313331';

    // Address of the deployed contract
    const contractAddress = '0x...';

    // Connect to the existing contract
    const contract = await viem.getContractAt('MyToken', contractAddress);

    const balanceBN = await contract.read.balanceOf([yourAddress]);
    console.log(
        `Account ${yourAddress} has ${formatEther(
            balanceBN
        )} decimal units of MyToken\n`
    );
    const votes = await contract.read.getVotes([yourAddress]);
    console.log(
        `Account ${yourAddress} has ${formatEther(
            votes
        )} units of voting power before self delegating\n`
    );
    const delegateTx = await contract.write.delegate([yourAddress], {
        account: yourAddress,
    });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    const votesAfter = await contract.read.getVotes([yourAddress]);
    console.log(
        `Account ${yourAddress} has ${formatEther(
            votesAfter
        )} units of voting power after self delegating\n`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
