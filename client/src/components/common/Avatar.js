 import React from 'react';
 
 const Avatar = ({avatar}) => {
     if(!avatar) return <img src={require('../../photos/default.jpg')} alt="User Avatar" className="avatar" />
     return <img src={require(`../../photos/${avatar}`)} alt="User Avatar" className="avatar" />
 }
 export default Avatar;