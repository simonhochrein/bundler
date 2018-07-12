import { isMaster } from 'cluster';

if (isMaster) {
    require('./master');
} else {
    require('./worker')
}