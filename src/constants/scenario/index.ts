import { texts } from 'constants/texts';

interface IScenarioMessageRender {
    name: string;
    type: string;
    placeholder?: string;
    directories?: string;
    required: boolean
}

export interface IScenarioMessage {
    id: number;
    type: IGlobal.type;
    message: string;
    reverse?: boolean;
    render: IScenarioMessageRender;
}

export const scenario: IScenarioMessage[] = [
    {
        id: 1,
        type: 'message',
        message: texts.dialogs.step1,
        render: {
            name: 'name',
            placeholder: 'Введите имя',
            type: 'CustomForm1',
            required: true
        }
    },
    {
        id: 2,
        type: 'message',
        message: texts.dialogs.step2,
        render: {
            name: 'type',
            type: 'select',
            placeholder: 'Выберите тип работы',
            directories: 'work_types',
            required: true
        }
    },
    {
        id: 3,
        type: 'message',
        message: texts.dialogs.step3,
        render: {
            name: 'theme',
            type: 'input',
            placeholder: 'Введите тему',
            required: true
        }
    },
    {
        id: 4,
        type: 'message',
        message: texts.dialogs.step4,
        render: {
            name: 'subject',
            placeholder: 'Введите предмет',
            type: 'creatable',
            directories: 'work_courses',
            required: true
        }
    },
    {
        id: 5,
        type: 'message',
        message: texts.dialogs.step5,
        render: {
            name: 'files',
            placeholder: 'Прикрепить файл',
            type: 'file',
            required: false
        }
    },
    {
        id: 6,
        type: 'message',
        message: texts.dialogs.step6,
        render: {
            name: 'note',
            placeholder: 'Комментарий',
            type: 'input',
            required: false
        }
    },
    {
        id: 7,
        type: 'message',
        message: texts.dialogs.step7,
        render: {
            name: 'email',
            placeholder: 'Введите E-mail',
            type: 'input',
            required: true
        }
    },
    {
        id: 8,
        type: 'message',
        message: texts.dialogs.step8,
        render: {
            name: 'phone',
            placeholder: '+7 (___) ___-__-__',
            type: 'inputPhone',
            required: true
        }
    },
    {
        id: 9,
        type: 'message',
        message: texts.warning.step9,
        render: {
            name: '',
            placeholder: '',
            type: '',
            required: true
        }
    }
];