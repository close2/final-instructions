import { generateKeys } from './script.js';

QUnit.module('Share Management', () => {
    QUnit.test('generates correct number of shares', assert => {
        const numShares = 5;
        const threshold = 3;
        const { shares } = generateKeys(numShares, threshold);
        assert.equal(shares.length, numShares);
    });

    QUnit.test('master key combines correct number of shares', assert => {
        const numShares = 5;
        const threshold = 3;
        const { masterKey } = generateKeys(numShares, threshold);
        assert.equal(masterKey.split('-').length, threshold);
    });

    QUnit.test('shares can reconstruct secret', assert => {
        const numShares = 5;
        const threshold = 3;
        const { shares } = generateKeys(numShares, threshold);
        const reconstructed = secrets.combine(shares.slice(0, threshold));
        assert.ok(reconstructed.length > 0);
    });
});
