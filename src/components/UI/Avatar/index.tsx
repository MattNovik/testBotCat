import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';

export interface IAvatarProps {
    children?: ReactNode
    botAvatar?: boolean;
    avatar?: string;
}

import './static/styles.scss';

const Avatar: FC<IAvatarProps> = ({
    botAvatar,
    avatar
}) => {
    return (<div className={classnames('botcat-avatar', { 'botcat-avatar--bot': botAvatar })}>{!botAvatar && avatar?.toUpperCase()}</div>);
}

Avatar.defaultProps = {
    children: '',
    botAvatar: false
}

export default Avatar;
