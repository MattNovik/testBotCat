import React, { FC, Fragment, memo, useState } from 'react';

import { Button, TextField, Icons, PopUp } from 'components/UI';
import './static/styles.scss';

import { validateEmail } from 'libs/utils';

interface IPropsCF {
    name: string;
    placeholder?: string;
    required: boolean;
    disabled?: boolean;
    format?: 'integer' | 'float' | 'floatSumm' | 'phone' | 'onlynumber' | 'text' | 'onlyText';
    onSetValue?(name: string, value: string | IGlobal.option[]): void;
}

const InputField: FC<IPropsCF> = memo(
    ({ name, format, placeholder, required, disabled, onSetValue }) => {
        const [value, setValue] = useState('');
        const [error, setError] = useState('');
        const [isOpen, setIsOpen] = useState(false);

        const handleSetName = (val: string) => {
            if (!required && !val) {
                val = 'Нет';
                setValue(val);
            }
            if (!!val && onSetValue) {
                if (name === 'email' && !validateEmail(val)) {
                    setError('Введите правильно email!');
                    setIsOpen(true);
                } else {
                    onSetValue(name, val);
                    setValue('');
                }
            }
        };

        const handleChange = (_name: string, value: string) => {
            setValue(value);
            setError('');
        };

        return (
            <Fragment>
                <form className='botcat-customform-name'>
                    <div className='botcat-customform-name__col botcat-customform-name__col--auto'>
                        <TextField
                            name={name}
                            value={value}
                            format={format}
                            type={name === 'email' ? 'email' : 'text'}
                            placeholder={placeholder}
                            onChange={handleChange}
                            disabled={disabled}
                            showMask={true}
                            error={!!error}
                        />
                    </div>
                    <div className='botcat-customform-name__col botcat-customform-name__col--none'>
                        <Button
                            onlyIcons
                            onClick={() => handleSetName(value)}
                            disabled={disabled || (required ? !!error || !value : false)}
                            type='submit'
                        >
                            <Icons.Send size={30} fill='#FFF' />
                        </Button>
                    </div>
                </form>

                <PopUp
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    className='botcat-popup--error'
                >
                    <div>{error}</div>
                </PopUp>
            </Fragment>
        );
    }
);

export default InputField;
