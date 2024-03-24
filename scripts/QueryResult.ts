import { abi } from '../artifacts/contracts/Ballot.sol/Ballot.json';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import * as dotenv from 'dotenv';

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || '';

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error('Parameters not provided');
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error('Contract address not provided');
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error('Invalid contract address');
    const address = parameters[1] as `0x${string}`;
    if (!address) throw new Error('Voter address not provided');
    if (!/^0x[a-fA-F0-9]{40}$/.test(address))
        throw new Error('Invalid voter address');
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(
            `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`
        ),
    });
    console.log('Voter structure for address: ' + address);
    const voter = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: 'voters',
        args: [address],
    })) as any[];
    console.log(voter);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
