import React, { FC, memo, useRef, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { connect } from 'react-redux';

import { scenario } from 'constants/scenario';

import { IRootState } from 'redux/modules/reducers';
import {
    getWorkTypesList,
    getCoursesList
} from 'redux/modules/User';

import './static/styles.scss';

import CustomForm1 from './Fields/customForm';
import SelectField from './Fields/select';
import CreatableField from './Fields/creatable';
import InputField from './Fields/input';
import PhoneField from './Fields/phone';
import FileField from './Fields/file';

import { work_courses } from 'constants/texts';

interface IStateProps {
    workTypesList: API.IWorkTypesList;
    coursesList: API.ICoursesList;
}

interface IProps extends IStateProps {
    /** Дочерний элемент */
    children?: ReactNode;
    /** Номер шага сценария */
    step: number;
    /**  Состояние отвечает бот или нет */
    prints?: boolean;
    onNextStep?(e: MouseEvent | KeyboardEvent): void;
    onChange?(name: string, value: string): void;
}

const mapStateToProps = (state: IRootState): IStateProps => ({
    workTypesList: getWorkTypesList(state),
    coursesList: getCoursesList(state)
});

const DialogsInput: FC<IProps> = memo(({
    workTypesList,
    coursesList,
    step,
    prints,
    onChange
}) => {
    const inputPanel = useRef<HTMLInputElement>(null);

    const getOptions = (list: any) => {
        const options: IGlobal.option[] = [];

        if(!list.length) return [];

        list.map((item: any) => options.push({ value: item.id, label: item.name }));

        return options;
    }

    const renderField = () => {
        const newStep = !!prints ? step + 1 : step;
        const { type, name, placeholder, directories, required } = scenario[newStep].render;

        const lists: any = {
            work_types: !!workTypesList && workTypesList.list,
            work_courses: !!coursesList ? coursesList.list : work_courses
        };

        switch(type) {
            case 'CustomForm1':
                return <CustomForm1 name={name} required={required} placeholder={placeholder} onSetValue={onChange} />
            case 'creatable':
                return <CreatableField name={name} disabled={prints} required={required} placeholder={placeholder} onSetValue={onChange} options={getOptions(!!directories ? lists[directories] : [])} />
            case 'select':
                return <SelectField name={name} disabled={prints} required={required} placeholder={placeholder} onSetValue={onChange} options={getOptions(!!directories ? lists[directories] : [])} />
            case 'input':
                return <InputField name={name} disabled={prints} required={required} placeholder={placeholder} onSetValue={onChange} />
            case 'inputPhone':
                return <PhoneField name={name} disabled={prints} required={required} placeholder={placeholder} onSetValue={onChange} />
            case 'file':
                return <FileField name={name} disabled={prints} required={required} placeholder={placeholder} onSetValue={onChange} />
            default:
                return '';
        }
    }

    return (
        <div
            className='botcat-input-panel'
            ref={inputPanel}
        >   
            {renderField()}
        </div>
    );
});

DialogsInput.defaultProps = {};

export default connect(mapStateToProps)(DialogsInput);