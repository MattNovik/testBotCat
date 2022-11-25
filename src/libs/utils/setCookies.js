import Cookies from 'js-cookie';

export default function setCookies(name, value) {
    const domainArr = window.location.hostname.split('.');

    let domain = '';

    if (domainArr.length < 3) {
        if (domainArr[0] === 'localhost') {
            domain = domainArr.join('.');
        } else {
            domain = `.${domainArr.join('.')}`;
        }
    } else {
        domain = `.${domainArr.slice(1).join('.')}`;
    }

    Cookies.set(name, value, { expires: 365, domain: domain });
}
