import { Record, RecordOf } from 'immutable';

/**
 * Функция, создающая объект Record
 * @param {I} defaultValue Значение по умолчанию
 * @return {RecordOf<I>} объект Record
 */
export function createRecord<I>(defaultValue: I, nameRecord: string): RecordOf<I> {
    const Rec: Record.Factory<I> = Record(defaultValue, nameRecord);

    return Rec();
}

/**
 * Поиск всех объектов Record в объекте параметров и возврат списка их constructor'ов
 * @param data объект параметров
 * @return список constructor'ов Record
 */
export function recordConstructors(data: object | RecordOf<any>): Record.Factory<any>[] {
    let arr: Record.Factory<any>[] = [];

    function recursion(obj: object | RecordOf<any>): void {
        if (obj instanceof Record) {
            arr = [...arr, obj.constructor as Record.Factory<typeof arr>];
        }

        const recordObj: { [x: string]: any } =
            obj instanceof Record ? (obj as RecordOf<typeof obj>).toObject() : obj;
        const arrKey = Object.keys(recordObj);

        arrKey.forEach(key => {
            if (recordObj[key] instanceof Record) {
                recursion(recordObj[key]);
            }
        });
    }

    recursion(data);

    return arr;
}
