import React, { FC, Fragment, memo, useState } from 'react';

import { Button, Icons } from 'components/UI';
import './static/styles.scss';

import Select from 'react-select';

interface IPropsCF {
    name: string;
    placeholder?: string;
    options: any;
    required: boolean;
    disabled?: boolean;
    onSetValue?(name: string, value: string | IGlobal.option[]): void;
}

const SelectField: FC<IPropsCF> = memo(({
    name,
    placeholder,
    options,
    required,
    disabled,
    onSetValue
}) => {
    const [value, setValue] = useState('');
    const [error] = useState('');

    const handleSetName = (val: string | IGlobal.option[] | null) => {
        if(!!val && onSetValue) {
            onSetValue(name, val);
            setValue('');
        }
    }

    const handleChange = (selected?: IGlobal.option | IGlobal.option[] | null) => {
        const data: any = selected;
        setValue(data.value);
    }

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            height: '44px',
            borderRadius: state.isFocused ? '0 0 16px 16px' : '16px',
            boxShadow: 'none',
            outline: 'none',
            border: '0px'
        }),
        valueContainer: (provided: any) => ({
            ...provided,
            padding: '2px 21px'
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#190134',
            fontSize: '14px'
        }),
        indicatorSeparator: (provided: any) => ({
            ...provided,
            display: 'none'
        }),
        indicatorsContainer: (provided: any) => ({
            ...provided,
            color: '#190134',
            paddingRight: '12px'
        }),
        menu: (provided: any) => ({
            ...provided,
            borderRadius: '16px 16px 0 0',
            maxHeight: '200px',
            overflow: 'hidden',
            zIndex: '999',
            color: '#190134',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.15)',
            marginBottom: '0px'
        }),
        menuList: (provided: any) => ({
            ...provided,
            padding: '0px'
        }),
        option: (provided: any) => ({
            ...provided,
            padding: '12px 21px'
        }),
        singleValue: (provided: any, state: any) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 300ms';
        
            return { ...provided, opacity, transition };
        }
    };

    return (
        <Fragment>
            <form className='botcat-customform-name'>
                <div className='botcat-customform-name__col botcat-customform-name__col--auto'>
                    <Select
                        noOptionsMessage={() => name === 'theme' ? "Тип работы не найден" : ""}
                        styles={customStyles}
                        name={name}
                        placeholder={placeholder}
                        onChange={handleChange}
                        options={options}
                        disabled={disabled}
                        menuPlacement='top'
                        menuPosition='absolute'
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
        </Fragment>
    );
});

export default SelectField;