import { viem } from 'hardhat';
import { parseEther, formatEther } from 'viem';

const MINT_VALUE = parseEther('1000');
async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer] = await viem.getWalletClients();
    const contract = await viem.deployContract('MyToken');
    console.log(`Token contract deployed at ${contract.address}\n`);
    const mintTx = await contract.write.mint([
        deployer.account.address,
        MINT_VALUE,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(
        `Minted ${formatEther(MINT_VALUE)} decimal units to account ${
            deployer.account.address
        }\n`
    );
    const balanceBN = await contract.read.balanceOf([deployer.account.address]);
    console.log(
        `Account ${deployer.account.address} has ${formatEther(
            balanceBN
        )} decimal units of MyToken\n`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
