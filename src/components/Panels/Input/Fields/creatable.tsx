import React, { FC, Fragment, memo, useState } from 'react';

import classnames from 'classnames';

import { Button, TextField, Icons, PopUp } from 'components/UI';
import './static/styles.scss';

interface IPropsCF {
    name: string;
    placeholder?: string;
    required: boolean;
    disabled?: boolean;
    options?: IGlobal.option[];
    format?: 'integer' | 'float' | 'floatSumm' | 'phone' | 'onlynumber' | 'text' | 'onlyText';
    onSetValue?(name: string, value: string | IGlobal.option[]): void;
}

const CreatableInputField: FC<IPropsCF> = memo(({
    name,
    format,
    placeholder,
    required,
    disabled,
    options,
    onSetValue
}) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isAutocompliteOpen, setIsAutocompliteOpen] = useState(false);

    const handleSetName = (val: string) => {
        if(!required && !val) val = 'Нет'; 
        if(!!val && onSetValue) {
            onSetValue(name, val);
            setValue('');
        }
    }

    const handleChange = (_name: string, value: string) => {
        setValue(value);
        setError('');
        setIsAutocompliteOpen(true);
    }

    const handleAddValue = (value: string) => {
        setValue(value);
        setError('');
        
        setTimeout(() => setIsAutocompliteOpen(false), 100);
    }

    const renderAutocomplite = () => {
        if(!options?.length) return false;
        if(!value || value.length < 3) return false;

        const newList = options.filter((item: IGlobal.option) => item.label.toLowerCase().indexOf(value.toLowerCase()) !== -1);

        if(!newList.length) return false;

        return (
            <div className={classnames('botcat-customform-autocomplite', { 'open': !!isAutocompliteOpen })}>
                <div className='botcat-customform-autocomplite__scroll'>
                    {newList.map((item: IGlobal.option, key: number) => {
                        return <div className='botcat-customform-autocomplite__item' onClick={() => handleAddValue(item.label)} key={key}>{item.label}</div>;
                    })}
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            <form className='botcat-customform-name'>
                {renderAutocomplite()}
                <div className='botcat-customform-name__col botcat-customform-name__col--auto'>
                    <TextField
                        name={name}
                        value={value}
                        format={format}
                        type='text'
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

export default CreatableInputField;