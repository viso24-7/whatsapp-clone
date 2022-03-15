 import {SIGNUP_USER,LOGIN_USER,LOGOUT_USER,GET_USER_DATA,UPDATE_USER_DATA} from '../actions/types';

 export default (state=[],action) => {
     let pl = action.payload;
     switch(action.type){
         case GET_USER_DATA:
             return pl;
         case SIGNUP_USER:
             return pl;
         case LOGIN_USER:
             return pl;
         case LOGOUT_USER:
             return null;
         case UPDATE_USER_DATA:
             return pl;
         
         default:
             return state;    
     }
 }