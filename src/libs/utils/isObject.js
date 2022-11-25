export default function isObject(obj) {
    return {}.toString.call(obj).slice(8, -1) === 'Object';
}
