import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import * as fs from 'fs';


export class encrypt {
    /* constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { } */

    /* async encryptData(data: string) {
        const existsCache = this.cacheManager.get('user_data');

        const textToEncrypt = data['textToEncrypt'];
        const publicKeyValue = existsCache['publicKey'];
        const publicKey = {
            key: publicKeyValue,
            padding: crypto.constants.RSA_PKCS1_PADDING
        };

        const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(textToEncrypt)).toString('base64');
        return encryptedData;
    } */

}
