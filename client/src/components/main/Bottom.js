 import React,{Component} from 'react';
 import _ from 'lodash';
 import SmileyIcon from 'material-ui/svg-icons/social/mood';
 import SendIcon from 'material-ui/svg-icons/content/send';
 
  class Bottom extends Component {
      render(){
          if(_.isEmpty(this.props.currentChatUser)){
              return <span />;
          }

          return (
              <div className="main-bottom-container">
                  <div className="main-botttom-smiley-div">
                      <SmileyIcon onClick={this.toggleSmiley} style={{height:30,width:30}}/>
                  </div>
                  <div className="main-bottom-input-div">
                      <input className="main-bottom-input"/>
                  </div>
                  <div className="main-bottom-send-div">
                     <SendIcon style={{height:30,width:30}}/>
                  </div>
              </div>
          )
      }
  }

  export default Bottom;