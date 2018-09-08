import moment from 'moment-timezone';

export function format(datetime) {
    return moment(datetime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}
