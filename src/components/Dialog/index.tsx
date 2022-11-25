import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';

import { Avatar, Tizer } from 'components/UI/';

import { ITizerProps } from 'components/UI/Tizer';
import { IAvatarProps } from 'components/UI/Avatar';

import './static/styles.scss';

interface IDialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, ''> {
    /** Дочерний элемент */
    children?: ReactNode;
    /** Имена классов */
    className?: string;
    /** Развернуть сообщение к правой стороне */
    reverse?: boolean;
    /** Тип сообщения */
    type?: IGlobal.type;
    /** Пропсы для аватарки */
    avatarProps?: IAvatarProps;
    /** Пропсы для тизера */
    tizerProps?: ITizerProps;
}

const Dialog: FC<IDialogProps> = ({
    children,
    className,
    reverse,
    type,
    avatarProps,
    tizerProps,
    ...otherProps
}) => {
    return (
            <div
                className={classnames(
                    'botcat-dialog',
                    className,
                    { 'botcat-dialog--reverse': reverse }
                )}
                {...otherProps}
            >
                {type !== 'system' ? <Avatar {...avatarProps} /> : ''}
                <Tizer {...tizerProps} type={type}>{children}</Tizer>
            </div>
    );
}

Dialog.defaultProps = {
    reverse: false,
    avatarProps: {},
    tizerProps: {}
}

export default Dialog;
