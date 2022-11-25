import { RecordOf } from 'immutable';
import { Reducer, Dispatch } from 'redux';

import { createRecord } from 'libs/utils/recordUtils';
import createAsyncActionName from 'libs/utils/createAsyncActionName';

import { fetchWorkTypesList, fetchCoursesList } from 'api/User';
import { IRootState } from '../reducers';

const FETCH_WORK_TYPES_LIST = createAsyncActionName('User/FETCH_WORK_TYPES_LIST');
const FETCH_COURSES_LIST = createAsyncActionName('User/FETCH_COURSES_LIST');

// prettier-ignore
interface IInitialState {
    data: {
        workTypesList: API.IWorkTypesList | null;
        coursesList: API.ICoursesList | null;
    };
    status: {
        workTypesList: string;
        coursesList: string;
    };
}

type TInitialState = RecordOf<IInitialState>;

// prettier-ignore
const initialState: TInitialState = createRecord<IInitialState>({
    data: {
        workTypesList: null, 
        coursesList: null
    },
    status: {
        workTypesList: '', 
        coursesList: ''
    }
}, 'user');

const reducer: Reducer<TInitialState> = (state = initialState, { type, payload }) => {
    switch (type) {
        case FETCH_WORK_TYPES_LIST.REQUEST:
            return state.setIn(['status', 'workTypesList'], 'fetching');
        case FETCH_WORK_TYPES_LIST.SUCCESS:
            // prettier-ignore
            return state.setIn(['data', 'workTypesList'], payload)
                        .setIn(['status', 'workTypesList'], 'complete');

        case FETCH_WORK_TYPES_LIST.FAIL:
            return state.setIn(['status', 'workTypesList'], 'error');

        case FETCH_COURSES_LIST.REQUEST:
            return state.setIn(['status', 'coursesList'], 'fetching');

        case FETCH_COURSES_LIST.SUCCESS:
            // prettier-ignore
            return state.setIn(['data', 'coursesList'], payload)
                        .setIn(['status', 'coursesList'], 'complete');
        case FETCH_COURSES_LIST.FAIL:
            return state.setIn(['status', 'coursesList'], 'error');

        default:
            return state;
    }
};

export default reducer;
export { TInitialState as TUserState };

/**
 * Actions
 */
export function actionFetchWorkTypesList() {
    return (dispatch: Dispatch): Promise<void> => {
        dispatch({ type: FETCH_WORK_TYPES_LIST.REQUEST });

        return fetchWorkTypesList()
            .then(data => {
                dispatch({ type: FETCH_WORK_TYPES_LIST.SUCCESS, payload: data });
            })
            .catch(error => {
                dispatch({ type: FETCH_WORK_TYPES_LIST.FAIL, payload: error });
            });
    };
}

export function actionFetchCoursesList() {
    return (dispatch: Dispatch): Promise<void> => {
        dispatch({ type: FETCH_COURSES_LIST.REQUEST });

        return fetchCoursesList()
            .then(data => {
                dispatch({ type: FETCH_COURSES_LIST.SUCCESS, payload: data });
            })
            .catch(error => {
                dispatch({ type: FETCH_COURSES_LIST.FAIL, payload: error });
            });
    };
}

/**
 * Selectors
 */
export const getWorkTypesList = (state: IRootState): API.IWorkTypesList =>
    state.user.getIn(['data', 'workTypesList']);

export const getWorkTypesListStatus = (state: IRootState): string =>
    state.user.getIn(['status', 'workTypesList']);

export const getCoursesList = (state: IRootState): API.ICoursesList =>
    state.user.getIn(['data', 'coursesList']);

export const getCoursesListStatus = (state: IRootState): string =>
    state.user.getIn(['status', 'coursesList']);
