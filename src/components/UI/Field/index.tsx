import React, { Fragment, useCallback, useRef, Ref, useEffect, forwardRef, useMemo } from 'react';
import IMask from 'imask';
import classnames from 'classnames';

import './static/styles';

export function setRef<T>(ref: Ref<T>, value: T | null) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        (ref as any).current = value;
    }
}

import config from './config';

export interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    error?: boolean;
    /**
     * Формат поля ввода
     *
     * @default 'text'
     */
    format?: 'integer' | 'float' | 'floatSumm' | 'phone' | 'onlynumber' | 'text' | 'onlyText';
    /**
     * Если `true`, будет отображена маска
     *
     * @example '+7 (___) ___-__-__'
     */
    showMask?: boolean;
    /**
     * Значение которое будет устанавливаться в незаполненные места маски
     *
     * @default '_'
     */
    placeholderChar?: string;
    /**
     * Значение после установки фокуса, соответствующее маске, применяется только если поле было пустое и `showMask !== true`
     *
     * @example '+7 ('
     */
    placeholderAfterFocus?: this['value'];
    /**
     * [Настройки маски](https://imask.js.org/guide.html#masked) для переопределения свойств масок установленных в `format`.
     *
     * Если будет установлено поле `mask`, то не будет происходить переопределения полей, а использоваться как независимая маска
     */
    maskOptions?: IMask.AnyMaskedOptions;
    /** Обработчик события при изменении */
    onChange?(name: string | undefined, value: string,  e: InputEvent): void;
}

const TextField = forwardRef<HTMLInputElement, IInputProps>(function InputNew(props, ref) {
    const {
        format = 'text',
        name,
        value: valueProp,
        defaultValue,
        maskOptions,
        showMask,
        placeholderChar = '_',
        autoFocus,
        error = false,
        onFocus,
        onBlur,
        onChange,
        placeholderAfterFocus,
        ...rest
    } = props;

    const isMount = useRef<boolean>(false);
    const maskRef = useRef<IMask.InputMask<any> | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const valueInputRef = useRef<HTMLInputElement | null>(null);
    const timerDestroy = useRef<number>();
    const maskProps = maskOptions?.mask ? maskOptions : config[format];
    const value = useRef(String(typeof valueProp !== 'undefined' ? valueProp : typeof defaultValue !== 'undefined' ? defaultValue : '') || undefined);
    const _defaultValue = useMemo<{
        masked?: string;
        unmasked?: string;
    }>(() => {
        if (autoFocus && typeof placeholderAfterFocus !== 'undefined' && !showMask && !value.current) {
            return { masked: String(placeholderAfterFocus) };
        }
        if (!value.current) return {};

        const mask = IMask.createMask(maskProps);

        return {
            masked: mask.resolve(value.current),
            unmasked: value.current
        };
    }, []);

    /** Инициализация маски */
    const initialMask = useCallback(() => {
        clearTimeout(timerDestroy.current);
        if (!inputRef.current || maskRef.current) return;

        maskRef.current = IMask(inputRef.current, {
            ...maskProps,
            lazy: !showMask,
            placeholderChar,
            ...(maskOptions?.mask ? undefined : (maskOptions as any))
        });
    }, []);

    /** Обработка значения относительно маски */
    const valueProcessing = useCallback((val?: string) => {
        if (!maskRef.current || !valueInputRef.current) return '';

        if (typeof val !== 'undefined') maskRef.current.value = val;

        let _value = '';

        if (format === 'floatSumm') {
            const sliceIndex = maskRef.current.value.replace(/\s/g, '').indexOf('+');

            if (~sliceIndex) {
                const left = maskRef.current.unmaskedValue.slice(0, sliceIndex);
                const right = maskRef.current.unmaskedValue.slice(sliceIndex);
                
                _value = `${left}${right ? `+${right}` : ''}`;
            }
        }

        if (!_value) {
            _value =
                typeof maskRef.current.mask === 'string' && maskRef.current.mask.includes(maskRef.current.unmaskedValue)
                    ? ''
                    : (format === 'phone' ? '+' : '') + maskRef.current.unmaskedValue;
        }

        return (valueInputRef.current.value = value.current = _value);
    }, []);

    useEffect(() => {
        if (value.current || autoFocus) {
            initialMask();

            if (autoFocus && maskRef.current) maskRef.current.on('accept', handlerAccept);
        }
    }, [maskProps]);

    useEffect(() => {
        if (!isMount.current) {
            isMount.current = true;

            return;
        }

        if (typeof valueProp !== 'undefined' && value.current !== valueProp) {
            // Обработка моментов, когда значение меняется, но маска еще не установлена
            initialMask();
            valueProcessing(String(valueProp));
        }
    }, [valueProp]);

    const handlerRef = useCallback((instance: null | HTMLInputElement) => {
        setRef(inputRef, instance);
        setRef(ref, instance);
    }, []);

    const handlerAccept = useCallback(
        (e: InputEvent) => {
            const value = valueProcessing();

            if (onChange) onChange(name, value, e);
        },
        [onChange]
    );

    const handlerFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            initialMask();

            if (typeof placeholderAfterFocus !== 'undefined' && !showMask && !value.current) valueProcessing(String(placeholderAfterFocus));
            if (maskRef.current) maskRef.current.on('accept', handlerAccept);

            if (onFocus) onFocus(e);
        },
        [maskProps, onFocus, handlerAccept]
    );

    const handlerBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            timerDestroy.current = window.setTimeout(() => {
                if (!maskRef.current) return;

                if (typeof maskRef.current.mask === 'string' && maskRef.current.mask.includes(maskRef.current.unmaskedValue)) {
                    maskRef.current.el.value = '';
                }

                maskRef.current.off('accept', handlerAccept).destroy();
                maskRef.current = null;
            }, 50);

            if (onBlur) onBlur(e);
        },
        [onBlur]
    );

    return (
        <Fragment>
            <input
                ref={valueInputRef}
                defaultValue={_defaultValue.unmasked}
                type={typeof defaultValue !== undefined ? rest.type : 'hidden'}
                name={name}
                style={{ display: 'none' }}
            />
            <input
                {...rest}
                defaultValue={_defaultValue.masked}
                autoFocus={autoFocus}
                ref={handlerRef}
                onFocus={handlerFocus}
                onBlur={handlerBlur}
                className={classnames('bot-cat__field', { 'bot-cat__field--error': error })}
            />
        </Fragment>
    );
});

export default TextField;
