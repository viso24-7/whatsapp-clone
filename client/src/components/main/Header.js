import React,{Component} from 'react';
import _ from 'lodash';
import MenuIcon from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from '../common/Avatar';
import {getLastSeenString} from '../../utils/helperMethods';

class Header extends Component {
    deleteContact = () => {
        const {deleteContactChat,currentChatUser} = this.props;
        deleteContactChat(currentChatUser)
    }

   render(){
      const {name,avatar,lastSeen,isTyping} = this.props.currentChatUser;
      if(_.isEmpty(this.props.currentChatUser)){
          return <div>Pick a Chat</div>
      }

      return(
          <div className="main-header-container">
               <div className="main-header-avatar">
                   <Avatar avatar={avatar} />
               </div>

               <div className="main-header-info">
                   <div>{name}</div>
                   <div>{getLastSeenString(isTyping,lastSeen)}</div>
               </div>

               <div className="main-header-info-icons">
                   <MenuIcon className="main-header-info-icon" />
               </div>
          </div>
      )
    }
}

export default Header;