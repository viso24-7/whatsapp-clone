import _ from 'lodash';
import {GET_CHAT_DATA,SEND_MESSAGE,DELETE_MESSAGE} from '../actions/types';

export default (state=[],action) => {
    let pl = action.payload;
    switch(action.type){
        case GET_CHAT_DATA:
            return _.values(pl.messages); //Creates an array of the own enumerable string keyed property values of object.
        case SEND_MESSAGE:
            return _.concat(state,pl); //Creates a new array concatenating state=[] with any additional arrays and/or values
        case DELETE_MESSAGE:
            return _.without(state,pl)

        default: 
             return state;    
    }
} 