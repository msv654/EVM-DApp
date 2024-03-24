import { createPublicClient, http, createWalletClient } from 'viem';
import { abi } from '../artifacts/contracts/Ballot.sol/Ballot.json';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || '';
const deployerPrivateKey = process.env.PRIVATE_KEY || '';

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error('Parameters not provided');
    const contractAddress = parameters[0] as `0x${string}`;
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error('Invalid contract address');
    const voterAddress = parameters[1];
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress))
        throw new Error('Invalid voter address');
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(
            `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`
        ),
    });

    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const wallet = createWalletClient({
        account,
        chain: sepolia,
        transport: http(
            `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`
        ),
    });
    const hash = await wallet.writeContract({
        address: contractAddress,
        abi,
        functionName: 'giveVoteRights',
        args: [voterAddress],
    });

    console.log(`Vote rights granted to: ${voterAddress}`);
    console.log('Transaction hash:', hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
