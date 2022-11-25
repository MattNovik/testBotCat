const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Функции проверки равенства двух объектов.
 *
 * @param {*} objA Первый объект
 * @param {*} objB Второй объект
 * @param {Boolean} [deep=false] Запускать ли глубокую проверку равенства
 * @returns {Boolean}
 */
export function isEqual(objA, objB, isDeep) {
    if (Object.is(objA, objB)) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }

    if (objA.prototype !== objB.prototype) {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    const bHasOwnProperty = hasOwnProperty.bind(objB);

    while (keysA.length > 0) {
        const key = keysA.pop();

        if (!bHasOwnProperty(key)) {
            return false;
        }

        const a = objA[key];
        const b = objB[key];

        if (!Object.is(a, b)) {
            if (
                !isDeep ||
                typeof a !== 'object' ||
                typeof b !== 'object' ||
                a === null ||
                b === null
            ) {
                return false;
            }

            if (!isEqual(a, b, isDeep)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * "Поверхностная" проверка равенства props и state компонента.
 *
 * @param {*} nextProps next component props
 * @param {*} nextState next component state
 * @param {*} nextContext next component context
 * @returns {Boolean}
 */
function shallow(nextProps, nextState, nextContext) {
    return (
        !isEqual(this.props, nextProps) ||
        !isEqual(this.state, nextState) ||
        !isEqual(this.context, nextContext)
    );
}

/**
 * Запускает глубокую проверку равенства props и state компонента.
 * Глубокая проверка менее производительна, но позволяет проверять равенство массивов и объектов.
 *
 * @param {*} nextProps next component props
 * @param {*} nextState next component state
 * @param {*} nextContext next component context
 * @returns {Boolean}
 */
function deep(nextProps, nextState, nextContext) {
    return (
        !isEqual(this.props, nextProps, true) ||
        !isEqual(this.state, nextState, true) ||
        !isEqual(this.context, nextContext, true)
    );
}

/**
 * Декоратор для улучшения производительности React компонентов. Работает за счет реализации метода
 * [shouldComponentUpdate](https://facebook.github.io/react/docs/advanced-performance.html#avoiding-reconciling-the-dom).
 *
 * У декоратора есть два режима работы - глубокая и "поверхностная" проверка. В случае, если все props и state
 * компонента состоит только из примитивных значений (`number`, `string`, `null`, `undefined`) стоит использовать
 * поверхностную проверку, которая будет проверять простое равенство значений в `props` и `state`.
 * В случае, если props или state компонентов имеют сложную структуру (массивы, объекты) необходимо использовать
 * глубокую проверку.
 *
 * @param {Boolean} [useDeep=false] Использовать глубокую проверку равенства
 * @returns {Function}
 */
export default function performance(useDeep = false) {
    return target => {
        target.prototype.shouldComponentUpdate = useDeep ? deep : shallow;
    };
}
