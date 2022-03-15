import {combineReducers} from 'redux';
import User from './user'
import Avatars from './avatars';
import ChatUser from './chatUser';
import ContactList from './contactList';
import ChatMessages from './chatMessages'
import SearchFriends from './searchFrIends';

export default combineReducers({
    user: User,
    avatars: Avatars,
    chat: ChatUser,
    list: ContactList,
    messages: ChatMessages,
    search: SearchFriends
})