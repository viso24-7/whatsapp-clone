import {GET_CHAT_DATA} from '../actions/types';

export default (state=[],action) => {
    switch(action.type){
        case GET_CHAT_DATA:
            return action.payload.contact;
        default:
            return state;    
    }
}