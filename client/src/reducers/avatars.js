import {GET_AVATARS} from '../actions/types';
export default (state=[],action) => {
    switch(action.type){
        case GET_AVATARS:
            return action.payload;
        default:
            return state;    
    }
}