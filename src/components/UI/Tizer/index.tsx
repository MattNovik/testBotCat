import React, { FC, ReactNode } from 'react';

export interface ITizerProps {
    /** Дочерний элемент */
    children?: ReactNode;
    /** Флаг состояния Печатает */
    prints?: boolean;
    /** Тип отображения тизера сообщения */
    type?: IGlobal.type;
}

import './static/styles.scss';

const Tizer: FC<ITizerProps> = ({
    children,
    prints = true,
    type
}) => {
    const printBox = () => {
        return (
            <div className='botcat-tizer__prints'>
                <i></i>
                <i></i>
                <i></i>
            </div>
        );
    }

    const getTizer = () => {
        switch(type) {
            case 'system':
                return renderTizerSystem;
            case 'estimateinfo':
                return renderTizerSystem;
            default:
                return renderTizerMessage;
        }
    }

    const renderTizerMessage = (
        <div className='botcat-tizer'>{!prints ? children : printBox()}</div>
    );

    const renderTizerSystem = (
        <div className='botcat-tizer-system'>{children}</div>
    );

    return (<>{getTizer()}</>);
}

Tizer.defaultProps = {
    type: 'message',
    prints: false
}

export default Tizer;
