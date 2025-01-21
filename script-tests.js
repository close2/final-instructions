import { generateKeys, validatePassword } from './script.js';

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

QUnit.module('Password Validation', () => {
    QUnit.test('validates correct password format', assert => {
        const validPasswords = [
            '80117c78810be0647b57056f7edc67d87ddff089017160e30edaf309923565a5321b0a5046de54edfa7f4d0efadbe08a109',
            '802bf0c99c69d22270f332a9b588b0376560aae347be3d7849a47080e95038f08f36509a7a0306dd4c08b5e40a9d186a635',
            '8032586c2dcd0b76858ba5cd5ffbf8745626bd7cf6647280b84497d57d21cd8717325ac111a4bb6b399d137d318cc41525b'
        ];

        validPasswords.forEach(password => {
            assert.true(validatePassword(password), `Password ${password} should be valid`);
        });
    });

    QUnit.test('rejects invalid password format', assert => {
        const invalidPasswords = [
            '70117c78810be0647b57056f7edc67d87ddff089017160e30edaf309923565a5321b0a5046de54edfa7f4d0efadbe08a109', // Wrong first digit
            '801999999999', // Too short
            '80117c78810be0647b57056f7edc67d87ddff089017160e30edaf309923565a5321b0a5046de54edfa7f4d0efadbe08a1099', // Too long
            '999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999', // Valid length but wrong format
            '80117c78810be0647b57056f7edc67d87ddff089017160e30edaf309923565a5321b0a5046de54edfa7f4d0efadbe08a10x', // Invalid character
            '999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999', // Valid length but wrong format
            '' // Empty string
        ];

        invalidPasswords.forEach(password => {
            assert.false(validatePassword(password), `Password ${password} should be invalid`);
        });
    });
});
