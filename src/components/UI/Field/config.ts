import IMask from 'imask';

import type { IInputProps } from './';

const floatMaskOptions: IMask.AnyMaskedOptions = {
    mask: IMask.MaskedNumber,
    min: 1,
    max: 1000000000,
    scale: 2,
    radix: ',',
    mapToRadix: ['.', 'б', 'ю'],
    thousandsSeparator: ' ',
    normalizeZeros: true
};

const config: Record<Required<IInputProps>['format'], IMask.AnyMaskedOptions> = {
    phone: {
        mask: '+{7} (000) 000-00-00',
        prepare: (appended: string, masked: IMask.Masked<any>) => {
            if ((appended === '8' || appended === '7') && masked.value === '+7 (') {
                return '';
            }
            return appended;
        }
    },
    float: { ...floatMaskOptions },
    floatSumm: {
        mask: 'F+F',
        blocks: {
            F: { ...floatMaskOptions }
        }
    },
    integer: { mask: IMask.MaskedNumber, min: 1, max: 1000000000, thousandsSeparator: ' ', normalizeZeros: true, scale: 0 },
    onlynumber: {
        mask: IMask.MaskedNumber,
        normalizeZeros: true,
        scale: 0
    },
    onlyText: {
        mask: /[а-яёa-z.,]*/i,
        prepare: (value: string) => value.replace(/\d/g, '')
    },
    text: {
        mask: /.*/
    }
};

export default config;
