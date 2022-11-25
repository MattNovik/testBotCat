import querystring from 'querystring';

export default function getUrlParams(search) {
    return querystring.parse(search.slice(search.indexOf('?') + 1));
}
