import config from '../config';
import jwt from 'jsonwebtoken';

async function sign(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            config.JWT_SECRET,
            {
                expiresIn: '30d'
            },
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                resolve(token);
            });
    });
}

async function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_SECRET, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

export  {
    sign,
    verify,
}
