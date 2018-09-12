// @flow
import request from 'request-promise';
import config from '../config';
import logger from '../logger';

let vendor;
class SmsVendor {
    username: string;
    password: string;
    url: string;


    constructor(username: string, password: string, url: string) {
        this.username = username;
        this.password = password;
        this.url = url;
    }

    static getInstance() {
        if (!vendor) {
            vendor = new SmsVendor(config.SMS_USERNAME, config.SMS_PASSWORD, config.SMS_URL);
        }
        return vendor;
    }

    async sendVerifyCode(mobile, code): Promise<boolean> {
        try {
            const res = await request({
                method: 'POST',
                url: this.url,
                form: {
                    method: 'sendSMS',
                    isLongSms: 0,
                    username: this.username,
                    password: this.password,
                    mobile: mobile,
                    content: encodeURIComponent(`【游戏大玩家】您的验证码是：${code}。请不要把验证码泄露给其他人。`)
                }
            });
            return true;
        } catch (e) {
            logger.error('[SmsVendor] sendVerifyCode ' + e.stack);
            return false;
        }
    }
}

export default SmsVendor;
