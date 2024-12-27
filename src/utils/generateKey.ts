import * as crypto from 'crypto';

export function generateKey(): string {
    const { privateKey } = crypto.generateKeyPairSync('ed25519');
    const base64PrivateKey = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString('base64');

    return base64PrivateKey;
}
