import React, { FC, memo, useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

import Dialog from 'components/Dialog';
import { IScenarioMessage } from 'constants/scenario';

import StudcatImage from 'static/img/studcat.svg';
import './static/styles.scss';

import { ITypesList } from 'containers/App';

export interface IDialogsItemsProps {
    [key: string]: string;
}

interface IProps {
    dialogs: IScenarioMessage[];
    step?: number;
    prints: boolean;
    items?: IDialogsItemsProps;
    typesList?: ITypesList;
}

const DialogsPanel: FC<IProps> = memo(({
    dialogs,
    // step,
    prints,
    items
}) => {
    const dialogsPanel = useRef<any>(null);

    useEffect(() => {
        if(dialogsPanel && dialogsPanel.current) {
            dialogsPanel.current.scrollToBottom();
        }
    }, [dialogs]);

    const getAvatar = () => {
        if(!!items && !!items.name) {
            return items.name[0];
        }
        
        return 'A';
    }

    return (
        <div
            className='botcat-dialogs-panel'
        >
            <Scrollbars
                ref={dialogsPanel}
            >
                <div className='botcat-dialogs-panel__content'>
                    <Dialog
                        type='system'
                    >
                        <h1>😻 Привет, я StudCat, помощник Студсервиса!</h1>
                        <p>Студсервис — это сервис помощи студентам! Мы являемся лидерами в этой сфере и вы всегда можете на нас рассчитывать.</p>
                        <p>Чтобы рассчитать цену, ответьте на несколько вопросов ниже:</p>
                        <div style={{ textAlign: 'center' }}><img src={StudcatImage} alt='' /></div>
                    </Dialog>
                    {dialogs.map((dialog: IScenarioMessage, index: number) => {
                        return (
                            <Dialog
                                key={index}
                                avatarProps={{
                                    botAvatar: !dialog.reverse,
                                    avatar: getAvatar()
                                }}
                                reverse={dialog.reverse}
                                type={dialog.type}
                            >
                                {dialog.message}
                            </Dialog>
                        );
                    })}

                    {prints ? (
                        <Dialog
                            avatarProps={{
                                botAvatar: true
                            }}
                            tizerProps={{
                                prints: true
                            }}
                            type='message'
                        />
                    ) : ''}
                </div>
            </Scrollbars>
        </div>
    );
});

DialogsPanel.defaultProps = {
    dialogs: []
};

export default DialogsPanel;