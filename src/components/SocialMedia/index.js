// @flow

import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';

const iconStyle = {
  width: 40,
  marginRight: 10,
};

const MediaIcon = props => (
  <a href={props.url} target="_blank" rel="noopener noreferrer">
    <img
      style={iconStyle}
      src={`/img/svg/social-media/${props.icon}`}
      alt={props.iconAlt}
    />
  </a>
);

export default class SocialMedia extends React.Component<{}> {
  render() {
    const { facebook, twitter, snapchat, instagram } = this.props.socials;
    return (
      <div style={{ marginTop: 10 }}>
        {facebook && (
          <MediaIcon url={facebook} icon="Facebook.svg" iconAlt="fb" />
        )}
        {twitter && (
          <MediaIcon url={twitter} icon="Twitter.svg" iconAlt="twitter" />
        )}
        {snapchat && (
          <MediaIcon url={snapchat} icon="Snapchat.svg" iconAlt="snapchat" />
        )}
        {instagram && (
          <MediaIcon url={instagram} icon="Instagram.svg" iconAlt="instagram" />
        )}
      </div>
    );
  }
}
