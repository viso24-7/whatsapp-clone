import React from 'react';
import Badge from 'material-ui/Badge'

const UnreadBadge = ({isUnread}) => {
    if(isUnread === "None") return <span />;

    return (
        <span className="pull-right unread-badge">
            <Badge badgeContent={isUnread === 0 ? "" : isUnread} color="primary" />>
        </span>
    )
}

export default UnreadBadge;