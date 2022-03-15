 import _ from 'lodash';
 import fire from '../firebase';
 import {getAvatarsNames} from '../utils/helperMethods'
 import {GET_AVATARS,SIGNUP_USER,LOGIN_USER,LOGOUT_USER,GET_USER_DATA,GET_FRIENDS_LIST,GET_CHAT_DATA,UPDATE_USER_DATA,
    SEND_MESSAGE,DELETE_MESSAGE,DELETE_CONTACT_CHAT,PINORUNPIN_CHAT,UNRAED_CHAT,SEARCH_FRIENDS,ADD_AS_FRIEND} from './types';

 export const getAvatars = (callback) => {
    callback();
    return {
        type: GET_AVATARS,
        payload: getAvatarsNames()
    }
 }

 export const signUpUser = (email,name,avatar,uid,callback) => {
     return dispatch => {
         fire.database().ref(`users/${uid}`).set({uid,email,name,avatar,lastSeen:"Online"})
             .then(() => {
                 const user = {uid,email,name,avatar,lastSeen:"Online"};
                 dispatch({
                     type: SIGNUP_USER,
                     payload: user
                 });
                 callback();
             })
     }
 }

 export const loginUser = uid => {
     return dispatch => {
         fire.database().ref(`users/${uid}`).once('value', snapshot => {
             const user = snapshot.val();
             dispatch({
                 type: LOGIN_USER,
                 payload: user
             })
         })
     }
 }

 export const logoutUser = () => {
     return {
         type: LOGOUT_USER,
         payload: null
     }
 }

 export const getFriendsList = (uid,callback) => {
   let friendsArray = [];
   return dispatch => {
       fire.database().ref(`friendship/${uid}`).once('value', friendsSnap => {
           const friends = friendsSnap.val() || {};
           Object.keys(friends).map((objKey) => {
               const {key,lastMessage,pinned,isUnread,isTyping} = friends[objKey];
               const friend = {key,lastMessage,pinned,isUnread,isTyping}
               fire.database().ref(`users/${key}`).once('value',nfrsnap => {
                   friend.info = nfrsnap.val();
                   friendsArray.push(friend);
               })
               return friend;
           })
       }).then(() => {
           dispatch({
               type: GET_FRIENDS_LIST,
               payload: friendsArray
           })
           callback();
       })
   }
 }

 export const getFriendsListReady = (friendsArray) => {
     return {
         type:GET_FRIENDS_LIST,
         payload: friendsArray
     }
 }

 export const getUserData = (uid,callback) => {
     let user = {};
     return dispatch => {
         fire.database().ref(`users/${uid}`).once('value', userSnap => {
            user = userSnap.val();
         }).then(() => {
             dispatch({
                 type: GET_USER_DATA,
                 payload: user
             })
             callback();
         })
     }
 }

 export const updateUserData = (newUser,callback) => {
     const {uid,name,email,avatar,lastSeen} = newUser;
     return dispatch => {
         fire.database().ref(`users/${uid}`).set({uid,name,email,avatar,lastSeen})
             .then(() => {
                 dispatch({
                     type: UPDATE_USER_DATA,
                     payload: newUser
                 })
                 callback();
             })
     }
 }

 export const sendMessage = (senderuid,receiveruid,message,callback) => {
     const {id,content,date,hour,sender} = message;
     const dataMsg = {id,content,date,hour,sender};
     return dispatch => {
         fire.database().ref(`friendships/${receiveruid}/${senderuid}/isUnread`).once('value', isUnread => {
             const numOfUnread = isUnread.val() === "None" ? 1 : isUnread.val() + 1;
             const updates = {};
             updates[`friendships/${receiveruid}/${senderuid}/isUnread`] = numOfUnread;
             updates[`messages/${senderuid}/${receiveruid}/${id}`] = dataMsg;
             updates[`messages/${receiveruid}/${senderuid}/${id}`] = dataMsg;
             updates[`friendships/${senderuid}/${receiveruid}/lastMessage`] = dataMsg;
             updates[`friendships/${receiveruid}/${senderuid}/lastMessage`] = dataMsg;

             fire.database().ref().update(updates).then(() => {
                 dispatch({
                     type: SEND_MESSAGE,
                     payload: message
                 });
                 callback();
             })
         })
     }
 }

 export const deleteMessage = (senderuid,receiveruid,message,callback) => {
     return dispatch => {
         fire.database().ref(`messages/${senderuid}/${receiveruid}/${message.id}`).remove().then(() => {
             fire.database().ref(`friendships/${senderuid}/${receiveruid}/lastMessage`).remove().then(() => {
                 dispatch({
                     type: DELETE_MESSAGE,
                     payload: message
                 })
                 callback();
             })
         })
     }
 }

 export const getChatData = (useruid,contact,callback) => {
     const chatData = {contact,messages:[]};
     const contactuid = contact.info.uid;
     return dispatch => {
         fire.database().ref(`messages/${useruid}/${contactuid}`).once('value', msgSnap => {
             const messages = msgSnap.val();
             chatData.messages = messages;
         }).then(() => {
             dispatch({
                 type: GET_CHAT_DATA,
                 payload: chatData
             })
             callback();
         })
     }
 }

 export const getChatDataUser = (chatData) => {
     return {
         type: GET_CHAT_DATA,
         payload: chatData
     }
 }

 export const deleteContactChat = (useruid,contact,callback) => {
     const contactuid = contact.key;
     return dispatch => {
         fire.database().ref(`messages/${userid}/${contactuid}`).remove().then(() => {
             fire.database().ref(`friendships/${useruid}/${contauid}`).remove().then(() => {
                 dispatch({
                     type: DELETE_CONTACT_CHAT,
                     payload: contact
                 })
                 callback();
             })
         })
     }
 }

 export const pinOrUnpinChat = (useruid,contact,isPinned,callback) => {
    return dispatch => {
        const updates = {};
        updates[`friendships/${useruid}/${contact.info.uid}/pinned`] = isPinned;
        fire.database().ref().update(updates).then(() => {
            dispatch({
                type: PINORUNPIN_CHAT,
                payload: contact
            })
            callback();
        })
    }
 }

 export const searchFriends = (friendsUids,callback) => {
     return dispatch => {
         fire.database().ref(`users`).once('value', snap => {
             const users = snap.val();
             const notFriend = [];
             _.map(users, u => {
                 if(!_.includes(friendsUids,u.uid)){
                     notFriend.push(u)
                 }
             })

             dispatch({
                 type: SEARCH_FRIENDS,
                 payload: notFriend
             })
             callback();
         })
     }
 }

 export const addAsFriend = (useruid,contact,callback) => {
     const contactuid = contact.uid;
     return dispatch => {
        fire.database().ref(`friendships/${useruid}/${contactuid}`).set({key:contactuid,pinned:false,isUnread:'None',isTyping:false}).then(() => {
            fire.database().ref(`friendships/${contactuid}/${useruid}`).set({key:useruid,pinned:false,isUnread:"None",isTyping:false}).then(() => {
                dispatch({
                    type: ADD_AS_FRIEND,
                    payload: contact
                })
                callback();
            })
        })
     }
 }

 export const markUnread = (useruid,contact,callback) => {
     const contactuid = contact.uid;
     return dispatch => {
        const updates= {};
        updates[`friendships/${useruid}/${contactuid}/isUnread`] = 0;
        fire.database().ref().update(updates).then(() => {
            dispatch({
                type: UNRAED_CHAT,
                payload: contact
            })
            callback()
        })
     }
 }