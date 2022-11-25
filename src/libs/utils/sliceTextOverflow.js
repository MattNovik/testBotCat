/**
 * Разделение строки по максимальному кол-ву символов,
 * оставшаяся часть строки формирует троеточия в конце
 * @param {string} string Исходная строка
 * @param {number} maxSize Максимальное кол-во символов до разделения
 * @return {string}
 */
export default function sliceTextOverflow(string, maxSize) {
    let firstPath = string;
    let secondPath = '';
    const spanStyles = [
        'display: inline-block',
        'text-overflow: ellipsis',
        'white-space: nowrap',
        'overflow: hidden',
        'vertical-align: top',
        'max-width: 50px'
    ].join(';');

    maxSize = maxSize || 0;

    if (maxSize > 0 && string.length > maxSize) {
        firstPath = string.slice(0, maxSize);
        secondPath = `
            <span style='${spanStyles}'>
                ${string.slice(-(string.length - maxSize))}
            </span>`;

        const matches = firstPath.match(/[^ ]+\s?$/);
        const word = string.slice(matches.index).match(/^[^ ]+/)[0];

        if (matches[0].length < word.length) {
            firstPath = string.slice(0, matches.index);

            secondPath = `
                <span style='${spanStyles}'>
                    ${string.slice(-(string.length - matches.index))}
                </span>`;
        }
    }

    return firstPath + secondPath;
}
