 import React,{Component} from 'react';
 import _ from 'lodash';
 import Message from './Message';
 import Loading from '../common/Loading';
 import ChatTimeBubble from '../common/ChatTimeBubble';
 
 class Content extends Component{
     state = {
         gesture: false,
         gestureText: "",
         loading: false
     }

     componentDidMount(){
         this.scrollToBottom();
         const {user,currentChatUser} = this.props;
         if(!_.isEmpty(user)){
             const useruid = user.uid;
             const contactid = currentChatUser.info.uid;
         }
     }

     componentDidUpdate(){ this.scrollToBottom()}
     scrollToBottom = () => {
       // this.messagesEnd.scrollIntoView({ behavior: "smooth" });
     }

   renderMessages(){
       const {user,currentChatMessages,currentChatUser} = this.props;
       let messages = currentChatMessages;
       if(!messages || messages.length === 0){
           return <span />
       }
       return (
           messages.map((message,index,messages) => {
               if(message && message.content !== ""){
                   let arrayToReturn = [];
                   if(index !== messages.length -1){
                       if(message.date !== messages[index + 1].date){
                           arrayToReturn.push(<ChatTimeBubble key={`${message.id}bubble`} nextMessage={message[index+1]} />)
                       }
                   } 

                   arrayToReturn.push(<Message key={message.id} message={message} user={user} currentChatUser={currentChatUser} deleteMessage={deleteMessage} />)
                   return arrayToReturn;
               }
               return <span key={1} />
           })
       )
   }


   render(){
       if(_.isEmpty(this.props.currentChatUser)){
           return <div>Pick a chat</div>
       }

       return (
           <div id="scrollbar-conversation" className="scrollbare-conversation">
             {}
           </div>
       )
   }
 }