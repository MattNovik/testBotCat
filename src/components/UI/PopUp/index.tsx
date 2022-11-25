import React, { Component, ReactElement, Ref, MouseEvent, KeyboardEvent } from 'react';
import Popper, { Placement, Modifiers } from 'popper.js';
import classnames from 'classnames';
import ReactModal, { Props } from 'react-modal';
import isBrowser from 'is-browser';

import './static/styles.scss';

function setRef<T>(ref: Ref<T>, value: T | null) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        (ref as any).current = value;
    }
}

interface ReactPopUpProps
    extends Omit<
        Props,
        | 'isOpen'
        | 'ariaHideApp'
        | 'portalClassName'
        | 'onAfterOpen'
        | 'shouldCloseOnOverlayClick'
        | 'shouldCloseOnEsc'
        | 'shouldFocusAfterRender'
        | 'onRequestClose'
    > {}

export interface IPopUpProps extends ReactPopUpProps {
    /**
     * Элемент вызываемые открытие окна,
     * к которому происходит приклеивание (PopperJS) и для проверки закрытия окна
     * (чтобы не было конфликтов в режимах `overlay`: exist и not-exist)
     */
    author?: HTMLElement | null;
    /**
     * id root-div'a приложения. Решётку (#) указывать не надо.
     *
     * По умолчанию `root` или `app`
     */
    idAppElement?: string;
    /** Имена кастомных классов */
    className?: string;
    /** Если true, модальное окно открыто */
    open?: boolean;
    /** Позиция открытия */
    placement?: Placement;
    /** Модификации https://popper.js.org/popper-documentation.html#Popper.Defaults.modifiers */
    modifiers?: Modifiers;
    /** Координаты положения окна */
    posCoords?: { x: string | number; y: string | number };
    /** Позиционирование окна по Y */
    positionY?: 'top' | 'bottom' | 'center';
    /** Срабатывает при открытии */
    onOpen?(): void;
    /**
     * Срабатывает при закрытии
     *
     * Для корректной работы в режимах `overlay`: exist и not-exist, нужно установить `author`
     */
    onClose?(event?: MouseEvent | KeyboardEvent): void;
}


interface IState {
    showing: boolean;
}

ReactModal.setAppElement('#botcat');

class PopUp extends Component<IPopUpProps & { children?: ReactElement<Element> }, IState> {
    private appContainer = React.createRef<HTMLElement>();
    private contentRef: HTMLDivElement | undefined;
    private prevOpen: boolean;
    private idAfterOpen: number | undefined = undefined;
    private popper: Popper | null = null;

    static defaultProps: IPopUpProps = {
        idAppElement: 'app',
        role: 'document',
        closeTimeoutMS: 240,
        bodyOpenClassName: '',
        shouldReturnFocusAfterClose: true,
        positionY: 'center',
        placement: 'auto'
    };

    constructor(props: IPopUpProps) {
        super(props);

        const {
            idAppElement,
            open
        } = props;

        if (isBrowser) {
            let appContainer = document.getElementById(idAppElement || '');

            if (!appContainer) appContainer = document.getElementById('app');
            setRef(this.appContainer, appContainer);

            if (this.appContainer.current) {
                ReactModal.setAppElement(this.appContainer.current);
            }
        }

        this.prevOpen = Boolean(open);

        this.state = {
            showing: this.prevOpen
        };
    }

    componentDidUpdate(prevProps: IPopUpProps) {
        const { open } = this.props;

        if (prevProps.open === true && open === false) {
            if (this.idAfterOpen) clearTimeout(this.idAfterOpen);
        }

        this.checkerLockHTML();
    }

    static getDerivedStateFromProps(props: IPopUpProps, state: IState) {
        if (props.open && state.showing !== props.open) return { showing: props.open };

        return null;
    }
    
    componentWillUnmount() {
        this.popperDestroy();

        if (this.prevOpen) this.freeHTML();
    }

    checkerLockHTML() {
        if (this.prevOpen && !this.props.open) {
            this.freeHTML();
        }
        this.prevOpen = Boolean(this.props.open);
    }

    freeHTML() {
        return;
    }

    popperDestroy() {
        if (this.popper) {
            this.popper.destroy();
            this.popper = null;
        }
    }

    getPositionY() {
        let { positionY } = this.props;

        if (this.contentRef && this.contentRef.offsetHeight >= window.innerHeight - 40) {
            positionY = 'top';
        }

        return positionY;
    }

    handlerRequestClose = (e: MouseEvent | KeyboardEvent) => {
        this.handlerClose(e);
    }

    handlerClose = (e?: MouseEvent | KeyboardEvent) => {
        const { onClose } = this.props;

        if (onClose) onClose(e);
    };

    render() {
        if (!this.state.showing) return null;

        const {
            children: childrenProp,
            style,
            open,
            className
        } = this.props;

        let children = childrenProp;

        if (React.isValidElement(childrenProp)) {
            children = React.cloneElement<any>(childrenProp, { style: { ...childrenProp.props.style } });
        }

        return (
            <ReactModal
                isOpen={Boolean(open)}
                style={style}
                onRequestClose={this.handlerRequestClose}
                shouldCloseOnOverlayClick={true}
                className={classnames('botcat-popup', className)}
            >
                <div className='botcat-popup__close' onClick={this.handlerClose} />
                <div className='botcat-popup__content'>
                    {children}
                </div>
            </ReactModal>
        );
    }
}

export default PopUp;