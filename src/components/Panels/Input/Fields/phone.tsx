import React, { FC, Fragment, memo, useState } from 'react';

import { Button, TextField, Icons, PopUp } from 'components/UI';
import './static/styles.scss';

interface IPropsCF {
    name: string;
    placeholder?: string;
    required: boolean;
    disabled?: boolean;
    onSetValue?(name: string, value: string | IGlobal.option[]): void;
}

const PhoneField: FC<IPropsCF> = memo(({
    name,
    placeholder,
    required,
    disabled,
    onSetValue
}) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSetName = (val: string) => {
        if(!!val && onSetValue) {
            if(value.length !== 12) {
                setError('Введите правильно номер телефона!');
                setIsOpen(true);
            } else {
                onSetValue(name, val);
                setValue('');
            }
        }
    }

    const handleChange = (_name: string, value: string) => {
        setValue(value);
        setError('');
    }

    return (
        <Fragment>
            <form className='botcat-customform-name'>
                <div className='botcat-customform-name__col botcat-customform-name__col--auto'>
                    <TextField
                        name={name}
                        value={value}
                        format='phone'
                        type='tel'
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
                        disabled={disabled || (required ? (!!error || !value) : false)}
                        type='submit'
                    >
                        <Icons.Send
                            size={30}
                            fill='#FFF'
                        />
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
});

export default PhoneField;