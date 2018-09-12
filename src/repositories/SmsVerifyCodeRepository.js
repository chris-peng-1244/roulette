// @flow
import _ from 'lodash';
import redis from '../redis';

const SMS_VERIFY_CODE_PREFIX = 'sms-verify-code-';

class SmsVerifyCodeRepository {
    async generateVerifyCode(mobile: string): Promise<{error: string, code: string}> {
        const key = getUserKey(mobile);
        if (await redis.existsAsync(key)) {
            return {error: 'Already sent code', code: ''};
        }
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += String(_.random(0, 9));
        }

        await redis.setexAsync(key, 300, result);
        return {error: '', code: result};
    }

    async verifyCode(mobile: string, code: string): Promise<boolean> {
        const key = getUserKey(mobile);
        const storedCode = await redis.getAsync(key);
        return storedCode && storedCode === code;
    }

    async deleteVerifyCode(mobile: string) {
        await redis.delAsync(getUserKey(mobile));
    }
}

function getUserKey(mobile: string): string {
    return `${SMS_VERIFY_CODE_PREFIX}${mobile}`;
}

export default SmsVerifyCodeRepository;
