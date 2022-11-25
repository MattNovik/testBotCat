import * as devConstants from './dev';
import * as prodConstants from './prod';

let constants: { [x: string]: string } = devConstants;

switch (process.env.API_VER) {
    case 'production':
        constants = prodConstants;
        break;
    default:
        constants = devConstants;
        break;
}

export const API_URL = constants.API_URL;
export const API_AUTH = constants.API_AUTH;
