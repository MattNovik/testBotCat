import { combineReducers } from 'redux';

import user, { TUserState } from './User';

export interface IRootState {
    user: TUserState;
}

export default combineReducers<IRootState>({
    user
});
