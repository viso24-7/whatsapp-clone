 import React from 'react'
 import CircularProgress from 'material-ui/CircularProgress';

 const Loading = () => (
     <div className="loading-absolute">
        <CircularProgress size={80} thickness={5} />
     </div>
 )

 export default Loading;