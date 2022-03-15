import fire from '../firebase';
import _ from 'lodash';
import moment from 'moment';

export const readMessage = (useruid,contactid) => {
    const updates = {};
    updates[`friendship/${useruid}/${contactid}/isUnread`]
    fire.database().ref().update(updates);
}

export const updateStatusInConversation = (useruid,contactid,isTyping) => {
    const updates = {};
    updates[`friendship/${useruid}/${contactid}/isTyping`] = isTyping;
    fire.database().ref().update(updates)
}

export const updateLastSeen = (useruid,lastSeen,callback) => {
    const updates = {};
    updates[`users/${useruid}/lastSeen`] = lastSeen;
    fire.database().ref().update(updates).then(() => {
        callback();
    })
}

export const getLastSeenString = (isTyping,lastSeen) => {
    if(isTyping){ return "Typing ..." }
    if(lastSeen === "Online"){ return lastSeen;} // lastSeen === yyyy-mm-dd hh:mm:ss

    let splitted = lastSeen.split(" "),
        dateString = splitted[0],
        splittedDate = dateString.split('-'),
        hourString = splitted[1].split(':')
        splittedHour = hourString.split(':') 

     const date = new Date(splittedDate[0],splittedDate[1] -1,splittedDate[2]);
     if(checkIfToday(new Date(),date)){
         return `Last seen today at ${splittedHour[0]}:${splittedHour[1]}`
     }   
     if(checkIfYesterday(new Date(),date)){
         return `Last seen was yesterday at ${splittedHour[0]}:${splittedHour[1]}`
     }
     if(checkIfLastWeek(new Date(),date)){
        const day = getSeenDay(date.getDay());
        return `Last seen ${day} at ${splittedHour[0]}:${splittedHour[1]}`
     }

     return `Last seen at ${getCorrectDate(dateString)} ${getCorrectHour(hourString)}`
}

const checkIfToday = (today,dateObject) => {
    return moment(today).diff(moment(dateObject),'days') === 0;
}

const checkIfYesterday = (today,dateObject) => {
    return moment(today).diff(moment(dateObject),'days') === 1;
}

const checkIfLastWeek = (today,dateObject) => {
    return moment(today).diff(moment(dateObject),'days') < 7;
}

const getSeenDay = (day) => { //getDays return number 0 - 6 [o is sunday]
    dayNumber = day > 6 || day < 0 ? 0 : day;
    const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return weekDays[dayNumber];
}

export const getCorrectDate = (time) => {
    const dateArray = time.split('-');
    let year = dateArray[0],
        month = dateArray[1],
        date = dateArray[2]
    
        month = month < 10 ? `0${month}` : month
        day = day < 10 ? `0${day}` : day;
        return `${year}-${month}-${date}`
}

export const getCorrectHour = (time) => {
    const hourArray = time.split(':')
    let hour = hourArray[0];
    let minute = hourArray[1]
    hour = hour < 10 ? `0${hour}` : hour;
    minute = minute < 10 ? `0${minute}` : minute;
    return `${hour}:${minute}`
}

export const getDateHourFormat = () => {
    return moment().format('YYYY-MM-DD HH:mm'); //Will return 2020-4-7 11:30
}

export const sortByUid = array => {
    return array.sort();
}

export const getChar = num => {
    const posible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    return posible.charAt(num);
}

export const makeMessageId = () => {
    let date = new Date();
    let dateString = `${getChar(date.getFullYear() - 2000)}${getChar(date.getMonth())}${getChar(date.getDate())}`
    let hourString  = `${getChar(date.getHours())}${getChar(date.getMinutes())}${getChar(date.getSeconds())}`
    return `${dateString} ${hourString}`
}

export const validateEmails = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

export const validatePassword = (password) => {
    if(password.length < 6){
        return 'Make your password between 8 and 24 characters'
    } 
    return true;
}

export const filterBySearch = (array,subString) => {
    return _.filter(array,contact => {
        return contact.info.name.toLowerCase().startWith(subString.toLowerCase())
    })
}

export const sortContactsByLastMessageTime = array => {
    return array.sort((a,b) => {
        array.map(contact => {
            if(!contact.lastMessage){ //no last message
                contact.epoch = new Date(2020,4,7)
            } else {
               const splitDays = contact.lastMessage.date.split('-')
               const splitHours = contact.lastMessage.hour.split(':')
               const epoch = new Date(splitDays[0],splitDays[1],splitDays[2],splitHours[0],splitHours[1],splitHours[2]).getTime() / 1000
               contact.epoch = epoch;
            }

            return contact;
        });
        return (a.epoch > b.epoch) ? -1 : ((b.epoch > a.epoch) ? 1 : 0)
    })
}

export const splitToPinned = array => {
    const pinned = _.filter(array, contact => { return contact.pinned; })
    const notPinned = _.filter(array,contact => { return !contact.pinned; })
    return [...pinned,...notPinned] 
}

export const getLastMessageTime = lastMessage => {
    if(!lastMessage || lastMessage.date === "" || lastMessage.hour === "0:0:0"){
        return "";
    }

    const splitDate = lastMessage.date.split('-'),
          today = new Date(),
          dateObject = new Date(splitDate[0],splitDate[1] -1,splitDate[2]);

    if(checkIfToday(today,dateObject)) return getCorrectHour(lastMessage.hour)
    if(checkIfYesterday(today,dateObject)) return "Yesterday"
    if(checkIfLastWeek(today,dateObject)) return getSeenDate(dateObject.getDay())

    return `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`
}

export const getLastMessage = (isTyping,name,{content}) => {
    if(isTyping) return "Typing...";
    if(content){
        const textWidth = (window.innerWidth - 100) / 9;
        return content.length > textWidth ? `${content.subString(0,textWidth)}...`  : content;
    }
    return `Start converstaion with ${name}`; //no last message
}

export const getAvatarNames = () => {
    const numberOfAvatars = 7;
    const arrayOfAvatarsNames = [];
    arrayOfAvatarsNames.push('default.png');
    for(let i=1;i <= numberOfAvatars;i++){
        arrayOfAvatarsNames.push(`contact${i}.png`)
    }
    return arrayOfAvatarsNames;
}