import _ from 'lodash';
import {LOGOUT_USER,DELETE_CONTACT_CHAT,GET_FRIENDS_LIST,PINORUNPIN_CHAT,UNREAD_CHAT} from '../actions/types';

export default (state=[],action) => {
    let pl = action.payload;
    switch(action.type){
       case GET_FRIENDS_LIST:
           return pl;
       case DELETE_CONTACT_CHAT:
           return _.without(state,pl);
       case PINORUNPIN_CHAT:
           state[_.findIndex(state,{key:pl.key})] = pl;
           return state.slice();
       case UNREAD_CHAT:
           state[_.findIndex(state,{key:pl.key})] = pl;
           return state;
       case LOGOUT_USER:
           return [];
           
       default:
           return state;    
    }
}