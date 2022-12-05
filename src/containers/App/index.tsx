import React, { Fragment, PureComponent } from 'react';
import { RouteConfig } from 'react-router-config';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import vkBridge from '@vkontakte/vk-bridge';

import ym from 'react-yandex-metrika';

import { Button } from 'components/UI';
import { texts } from 'constants/texts';
import { API_AUTH } from 'constants/api';

import { IRootState } from 'redux/modules/reducers';
import {
    getWorkTypesList,
    getWorkTypesListStatus,
    getCoursesList,
    getCoursesListStatus,
    actionFetchWorkTypesList,
    actionFetchCoursesList
} from 'redux/modules/User';

// import { IRootState } from 'redux/modules/reducers';
import { scenario, IScenarioMessage } from 'constants/scenario';
import { DialogsPanel, DialogsInput } from 'components/Panels';
// import { IDialogsItemsProps } from 'components/Panels/Dialogs';

import { FormatText, PopUp } from 'components/UI';

import { getTypeFile } from 'libs/utils';

import {
    createOrderFromBot,
    editOrderFromBot,
    ICreateOrderFromBotData,
    IEditOrderFromBotData
} from 'api/User';

import './static/styles.scss';

export interface ITypesList {
    [key: string]: IGlobal.option;
}

interface IStateProps {
    workTypesList: API.IWorkTypesList;
    workTypesListStatus: string;
    coursesList: API.ICoursesList;
    coursesListStatus: string;
}

interface IDispatchProps {
    actionFetchWorkTypesList: typeof actionFetchWorkTypesList;
    actionFetchCoursesList: typeof actionFetchCoursesList;
}

interface IState {
    items: any;
    step: number;
    prints: boolean;
    dialogs: any;
    errors: any;
    isOpen: boolean;
    isVK: boolean;
    vkid: string | number;
    vkEmail: boolean | string;
    vkPhone: boolean | string;
    city: boolean | string;
    clientFrom: string | null;
}

interface IProps extends IStateProps, IDispatchProps, RouteConfig {}

const mapStateToProps = (state: IRootState): IStateProps => ({
    workTypesList: getWorkTypesList(state),
    workTypesListStatus: getWorkTypesListStatus(state),
    coursesList: getCoursesList(state),
    coursesListStatus: getCoursesListStatus(state)
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
    bindActionCreators(
        {
            actionFetchWorkTypesList,
            actionFetchCoursesList
        },
        dispatch
    );

const DEFAULT_STEP = 0; // was 0

class AppContainer extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            items: {},
            step: DEFAULT_STEP,
            prints: false,
            dialogs: [],
            errors: {},
            isOpen: false,
            isVK: false,
            vkid: '',
            vkEmail: false,
            vkPhone: false,
            city: false,
            clientFrom: ''
        };
    }

    prints = false;

    scenarioLength: number = scenario.length - 1;

    componentDidMount() {
        const { actionFetchWorkTypesList, actionFetchCoursesList } = this.props;
        const vh = window.innerHeight * 0.01;

        actionFetchWorkTypesList();
        actionFetchCoursesList();

        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // VK integ
        const location = document.location.search;
        const createURL = new URLSearchParams(location);
        const clientFrom = createURL.get('from');

        this.setState({ clientFrom: clientFrom });
        console.log(createURL.get('isVk'));
        if (createURL.get('isVk') === '1') {
            this.setState({ isVK: true });
            vkBridge
                .send('VKWebAppInit')
                .then(data => {
                    if (data.result) {
                        // Приложение инициализировано
                    } else {
                        console.log('error');
                        // Ошибка
                    }
                })
                .catch(error => {
                    // Ошибка
                    console.log(error);
                });

            vkBridge
                .send('VKWebAppGetUserInfo')
                .then(data => {
                    if (data.first_name) {
                        if (data.last_name) {
                            this.state.items.name = data.first_name;
                        }
                        if (data.id) {
                            this.setState({ vkid: data.id });
                        }
                        this.handleNextStep(this.state.step + 1);
                        this.setState({ city: data.city.title });
                    } else {
                        this.addMessage(scenario[this.state.step], false);
                    }
                })
                .catch(error => {
                    this.addMessage(scenario[this.state.step], false);
                    console.log(error);
                });
            /* 
            vkBridge
                .send('VKWebAppGetPhoneNumber')
                .then(data => {
                    console.log(data);
                    if (data.phone_number) {
                        this.state.items.phone = data.phone_number;
                        this.setState({ vkPhone: true });
                        // Данные получены
                    }
                })
                .catch(error => {
                    // Ошибка
                    console.log(error);
                });
            vkBridge
                .send('VKWebAppGetEmail')
                .then(data => {
                    if (data.email) {
                        this.state.items.email = data.email;
                        this.setState({ vkEmail: true });
                        // Данные получены
                    }
                })
                .catch(error => {
                    // Ошибка
                    console.log(error);
                }); */
        } else {
            this.addMessage(scenario[this.state.step], false);
        }
    }

    getFiles = (files: any) => {
        // const result: any = !!this.state.items.files ? [...this.state.items.files] : [];
        const result: any = [];
        const errors: any = [];

        Array.from(files).map((file: any) => {
            const type: string = getTypeFile(file);

            if (file.size === 3e7) {
                errors.push(`Размер файла "${file.name}" превышает 30Mb.`);

                return;
            }

            if (type === '') {
                errors.push(`Недопустимый тип файла "${file.name}".`);

                return;
            }

            const itemData: any = {
                name: file.name,
                file: file,
                type: type
            };

            result.push(itemData);
        });

        if (!!errors.length) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    files: errors
                },
                isOpen: true
            });
        }

        return result;
    };

    handleChange = (name: string, value: any) => {
        let go = true;
        let Type: any = '';
        let Course: any = '';

        const { items, step } = this.state;

        const work_types = !!this.props.workTypesList ? this.props.workTypesList.list : [];
        const work_courses = !!this.props.coursesList ? this.props.coursesList.list : [];

        let message: IScenarioMessage | any = {};

        if (name === 'type') {
            Type = !!work_types && work_types.find(item => item.id === value);
            value = !!Type ? Type?.name : '';
        }

        if (name === 'subject') {
            console.log('subject value', value);
            Course = !!work_courses && work_courses.find(item => item.id === value);
            value = !!Course ? Course?.name : value;
        }

        if (name !== 'files') {
            this.setState({
                items: {
                    ...items,
                    [name]: typeof value === 'string' ? value : ''
                }
            });
        }

        switch (name) {
            case 'name':
                if (!value) return;

                message = {
                    id: step + 10,
                    type: 'message',
                    message: value !== 'anonymous' ? value : 'Анонимный пользователь',
                    reverse: true
                };

                break;
            case 'type':
                if (!value) return;

                message = {
                    id: step + 10,
                    type: 'message',
                    message: !!Type && Type?.name,
                    reverse: true
                };

                break;
            case 'subject':
                if (!value) return;

                message = {
                    id: step + 10,
                    type: 'message',
                    message: !!Course ? Course?.name : value,
                    reverse: true
                };

                break;
            case 'files':
                const files = value !== 'Нет' ? this.getFiles(value) : null;

                if (value === 'Нет' && files === null) {
                    if (!this.state.items.files) {
                        message = {
                            id: step + 11,
                            type: 'message',
                            message: 'Нет',
                            reverse: true
                        };
                    }

                    message = {
                        id: step + 11,
                        type: 'message',
                        message: 'Next',
                        reverse: true
                    };

                    go = true;
                } else {
                    if (!files.length) {
                        go = false;

                        return;
                    }

                    if (!!files.length) {
                        message = {
                            id: step + 12,
                            type: 'message',
                            message: (
                                <Fragment>
                                    {files.map((file: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`botcat-file__item botcat-file__item--${file.type}`}
                                        >
                                            {file.name}
                                        </div>
                                    ))}
                                </Fragment>
                            ),
                            reverse: true
                        };

                        this.setState({
                            items: {
                                ...items,
                                files: [].concat(files, items.files),
                                filesData: [].concat(
                                    value,
                                    !!items.filesData ? items.filesData : []
                                )
                            }
                        });

                        go = false;
                    }
                }

                break;
            case 'phone':
                if (!value) return;

                message = {
                    id: step + 10,
                    type: 'message',
                    message: <FormatText format='phone' value={value} />,
                    reverse: true
                };

                break;
            default:
                message = {
                    id: step + 10,
                    type: 'message',
                    message: value,
                    reverse: true
                };

                break;
        }

        this.addMessage(message, go);
    };

    handleNextStep = (step: number) => {
        if (step <= this.scenarioLength) {
            this.setState(
                {
                    step: step,
                    prints: false
                },
                () => {
                    this.addMessage(scenario[step], false);
                }
            );
        }

        if (step === 7) this.createOrderFromBot();
        if (step === 8 && !!this.state.items.user_id) this.editOrderFromBot();
    };

    convertFilesToOrder = () => {
        const files: any = this.state.items.files;
        const result: string[] = [];

        files.map((file: any) => result.push(file.files));

        return result;
    };

    createOrderFromBot = () => {
        //ym(52970623,'reachGoal','ORDER_BOTCAT')
        const data: ICreateOrderFromBotData = {
            name: this.state.items.name !== 'anonymous' ? this.state.items.name : 'Клиент',
            email: this.state.items.email,
            type_of_work: this.state.items.type,
            theme: this.state.items.theme,
            course: this.state.items.subject,
            note: this.state.items.note,
            vkid: this.state.vkid,
            city: this.state.city,
            clientFrom: this.state.clientFrom
        };

        const files: any = this.state.items.filesData || null;

        createOrderFromBot(data, files)
            .then(response => {
                if (!!response.data) {
                    this.setState(
                        {
                            items: {
                                ...this.state.items,
                                order_id: response.data.order_id,
                                user_id: response.data.user_id,
                                hash: response.data.hash || '',
                                authtoken: response.data.authtoken || '',
                                estimate_info: response.data.estimate_info || {}
                            }
                        },
                        () => ym('reachGoal', 'ORDER_BOTCAT')
                    );
                }
            })
            .catch(errors => {
                console.log('errors', errors);
            });
    };

    editOrderFromBot = () => {
        const data: IEditOrderFromBotData = {
            user_id: this.state.items.user_id,
            phone: this.state.items.phone
        };

        if (!!this.state.items.hash) data.hash = this.state.items.hash;
        if (!!this.state.items.authtoken) data.authtoken = this.state.items.authtoken;

        editOrderFromBot(data)
            .then(response => {
                console.log('response', response);
            })
            .catch(errors => {
                console.log('errors', errors);
            });
    };

    addMessage = (message: IScenarioMessage, next: boolean) => {
        const newDialogs: IScenarioMessage[] | any = [...this.state.dialogs];

        if (this.state.isVK === false) {
            if (
                this.state.step === 1 &&
                this.state.items.name !== 'anonymous' &&
                this.state.dialogs.length <= 2
            ) {
                const oldMessage = message.message;

                message.message = `${texts.info.step1} ${this.state.items.name}! ${oldMessage}`;
            }
        } else {
            if (
                this.state.step === 1 &&
                this.state.items.name !== 'anonymous' &&
                this.state.dialogs.length < 1
            ) {
                const oldMessage = message.message;

                message.message = `${texts.info.step1} ${this.state.items.name}! ${oldMessage}`;
            }
        }

        if (message.message !== 'Next') {
            if (
                this.state.step === 8 &&
                !!this.state.items.estimate_info &&
                !!Object.keys(this.state.items.estimate_info).length
            ) {
                const estimate_info = { ...this.state.items.estimate_info };

                newDialogs.push({
                    id: 8.5,
                    type: 'system',
                    message: (
                        <div className='botcat-tizer-system__order'>
                            <strong>{this.state.items.type}</strong> на тему:{' '}
                            {this.state.items.theme}. <strong>Предмет:</strong>{' '}
                            {this.state.items.subject}.
                            <div className='botcat-tizer-system__order__price'>
                                Цена: {estimate_info.total_sale || estimate_info.total} ₽
                            </div>
                            {estimate_info.total_sale && (
                                <div className='botcat-tizer-system__order__oldprice'>
                                    Цена: {estimate_info.total} ₽
                                </div>
                            )}
                            {estimate_info.sale_available_to && (
                                <div className='botcat-tizer-system__order__description'>
                                    Цена со скидкой {estimate_info.sale_percent}% действительна до{' '}
                                    {estimate_info.sale_available_to}
                                </div>
                            )}
                        </div>
                    ),
                    render: {
                        name: '',
                        placeholder: '',
                        type: '',
                        required: true
                    }
                });

                const getPrepayTotal = () => {
                    const total = estimate_info.total_sale || estimate_info.total;

                    return Math.ceil((total / 100) * estimate_info.prepay);
                };

                newDialogs.push({
                    id: 9,
                    type: 'message',
                    message: !!estimate_info.prepay
                        ? `Ваш заказ успешно создан. Внесите предоплату всего ${
                              estimate_info.prepay
                          }% - ${getPrepayTotal()} руб., и мы сразу же приступим к работе.`
                        : 'Ваш заказ успешно создан. На почту Вам уже пришел логин и пароль от личного кабинета. ',
                    render: {
                        name: '',
                        placeholder: '',
                        type: '',
                        required: true
                    }
                });
            } else {
                newDialogs.push(message);
            }
        }

        this.setState(
            {
                dialogs: newDialogs,
                prints: !!next
            },
            () => {
                if (!!next) {
                    setTimeout(() => {
                        this.handleNextStep(this.state.step + 1);
                    }, 300);
                }
            }
        );
    };

    handleOpenOrder = () => {
        window.location.href = `${API_AUTH}auth/token=${this.state.items.authtoken}/email=${this.state.items.email}/hash=${this.state.items.hash}/order_id_info=${this.state.items.order_id}`;
    };

    handleOpenChat = () => {
        window.location.href = `${API_AUTH}auth/token=${this.state.items.authtoken}/email=${this.state.items.email}/hash=${this.state.items.hash}/order_id_chat=${this.state.items.order_id}`;
    };

    render() {
        const { items, step, dialogs, prints } = this.state;

        return (
            <div className='botcat-wrapper'>
                <DialogsPanel dialogs={dialogs} step={step} prints={prints} items={items} />
                {step !== -1 && step < this.scenarioLength && (
                    <DialogsInput step={step} prints={prints} onChange={this.handleChange} />
                )}
                {step === 8 && (
                    <div className='botcat-input-panel'>
                        <div className='botcat-customform-name'>
                            <div className='botcat-customform-name__col'>
                                <Button onClick={this.handleOpenOrder}>открыть заказ</Button>
                            </div>
                            <div className='botcat-customform-name__col'>
                                <Button kind='light' onClick={this.handleOpenChat}>
                                    задать вопрос
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                <PopUp
                    open={this.state.isOpen}
                    onClose={() => this.setState({ isOpen: false })}
                    className='botcat-popup--error'
                >
                    <div>
                        {!!this.state.errors.files &&
                            this.state.errors.files.map((text: string, key: number) => (
                                <p key={key}>{text}</p>
                            ))}
                    </div>
                </PopUp>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
