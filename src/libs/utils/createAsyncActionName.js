/**
 * Функция-хелпер которая создает имя экшена для асинхронного экшена
 * @param {string} actionName
 * @returns {{REQUEST: string, SUCCESS: string, FAIL: string, toString(): *}}
 */
export default actionName => ({
    REQUEST: `${actionName}_REQUEST`,
    SUCCESS: `${actionName}_SUCCESS`,
    FAIL: `${actionName}_FAIL`,
    toString() {
        return actionName;
    }
});
