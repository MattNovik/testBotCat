import React, { FC, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import classnames from 'classnames';

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface IButtonProps
    extends Omit<NativeButtonProps, 'onMouseOver' | 'onMouseLeave' | 'onFocus' | 'onBlur' | 'onMouseUp' | 'onMouseDown' | 'onKeyDown' | 'onKeyUp' | 'component'> {
    /** Дочерний элемент */
    children?: ReactNode;
    /** Имена кастомных классов */
    className?: string;
    kind?: 'primary' | 'light' | 'send'
    /** Тип отображения кнопки */
    type?: 'submit' | 'button' | 'reset';
    onlyIcons?: boolean;
    disabled?: boolean;
    onClick?(e: MouseEvent | KeyboardEvent): void;
}

import './static/styles.scss';

const Button: FC<IButtonProps> = ({
    children,
    className,
    type,
    disabled,
    kind,
    onlyIcons,
    onClick,
    ...otherProps
}) => {
    const handleClick = (e: MouseEvent | KeyboardEvent) => {
        if (onClick) onClick(e);
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={
                classnames(
                    'botcat-button',
                    {
                        [`botcat-button--${kind}`]: kind,
                        'botcat-button--onlyicons': onlyIcons,
                        'botcat-button--disabled': disabled
                    },
                    className
                )
            }
            onClick={handleClick}
            {...otherProps}
        >
            {children}
        </button>
    );
}

Button.defaultProps = {
    type: 'button',
    disabled: false,
    onlyIcons: false
}

export default Button;
