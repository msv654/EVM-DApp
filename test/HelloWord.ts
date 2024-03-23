import { expect } from 'chai';
import { viem } from 'hardhat';

describe('HelloWorld', function () {
    it('Should give a Hello World', async () => {
        const publicClient = await viem.getPublicClient();
        const [owner, otherAccount] = await viem.getWalletClients();
        const helloWorldContract = await viem.deployContract('HelloWorld');
        const helloWorldText = await helloWorldContract.read.helloWorld();
        expect(helloWorldText).to.eq('Hello World!');
    });
});
