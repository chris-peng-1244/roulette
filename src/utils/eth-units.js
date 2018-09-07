import {toWei as web3ToWei, fromWei as web3FromWei} from 'web3-utils';

function toWei(value, unit = 'ether') {
    return parseInt(web3ToWei(value.toString(), unit), 10);
}

function fromWei(value, unit = 'ether') {
    return web3FromWei(value.toString(), unit);
}

export {
    toWei,
    fromWei,
}
