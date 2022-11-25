import React, { FC, Fragment, memo, useState } from 'react';

import { Button, Uploader, Icons } from 'components/UI';
import './static/styles.scss';

interface IPropsCF {
    name: string;
    placeholder?: string;
    required: boolean;
    disabled?: boolean;
    onSetValue?(name: string, value: string | IGlobal.option[]): void;
}

const FileField: FC<IPropsCF> = memo(({
    name,
    placeholder,
    required,
    disabled,
    onSetValue
}) => {
    const [value, setValue] = useState('');
    const [error] = useState('');

    const handleSetName = (val: string) => {
        if(!!val && onSetValue) {
            onSetValue(name, val);
            setValue('');
        }
    }

    const handleChange = (_name: string, value: any) => {
        const files: any =  !!value ? Array.from(value) : [];
        
        handleSetName(files);
    }

    return (
        <Fragment>
            <form className='botcat-customform-name'>
                <div className='botcat-customform-name__col botcat-customform-name__col--auto'>
                    <Uploader
                        name={name}
                        placeholder={placeholder}
                        onChange={handleChange}
                        // disabled={disabled}
                    />
                </div>
                <div className='botcat-customform-name__col botcat-customform-name__col--none'>
                    <Button
                        onlyIcons
                        onClick={() => handleSetName(value || 'Нет')}
                        disabled={disabled || (required ? !!error : false)}
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

export default FileField;