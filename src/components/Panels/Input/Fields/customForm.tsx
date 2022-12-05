import React, { FC, Fragment, memo, useState } from 'react';

import { Button, TextField, Icons } from 'components/UI';
import './static/styles.scss';

interface IPropsCF {
    name: string;
    placeholder?: string;
    required: boolean;
    onSetValue?(name: string, value: string): void;
}

const CustomForm1: FC<IPropsCF> = memo(({ name, placeholder, required, onSetValue }) => {
    const [view, setView] = useState(0);
    const [value, setValue] = useState('');
    const [error] = useState('');

    const handleSetName = (val: string) => {
        if (!!val && onSetValue) {
            onSetValue(name, val);
            setValue('');
        }
    };

    const handleChange = (_name: string, value: string) => {
        setValue(value);
    };

    return (
        <Fragment>
            {view === 0 ? (
                <div className='botcat-customform-name'>
                    <div className='botcat-customform-name__col'>
                        <Button kind='primary' onClick={() => setView(1)}>
                            введите имя
                        </Button>
                    </div>
                    <div className='botcat-customform-name__col'>
                        <Button kind='light' onClick={() => handleSetName('anonymous')}>
                            анонимно
                        </Button>
                    </div>
                </div>
            ) : (
                <form className='botcat-customform-name'>
                    <div className='botcat-customform-name__col botcat-customform-name__col--auto'>
                        <TextField
                            name={name}
                            value={value}
                            placeholder={placeholder}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='botcat-customform-name__col botcat-customform-name__col--none'>
                        <Button
                            onlyIcons
                            onClick={() => handleSetName(value)}
                            disabled={required ? !!error || !value : false}
                            type='submit'
                        >
                            <Icons.Send size={30} fill='#FFF' />
                        </Button>
                    </div>
                </form>
            )}
        </Fragment>
    );
});

export default CustomForm1;
