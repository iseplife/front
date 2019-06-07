import React from 'react';

const iconStyle: React.CSSProperties = {
  width: 40,
  marginRight: 10,
};

type MediaIconProps = {
  url: string;
  icon: string;
  iconAlt: string;
};

const MediaIcon: React.FC<MediaIconProps> = props => (
  <a href={props.url} target="_blank" rel="noopener noreferrer">
    <img
      style={iconStyle}
      src={`/img/svg/social-media/${props.icon}`}
      alt={props.iconAlt}
    />
  </a>
);

interface SocialMediaProps {
  socials: {
    facebook?: string;
    twitter?: string;
    snapchat?: string;
    instagram?: string;
  };
}

const SocialMedia: React.FC<SocialMediaProps> = props => {
  const { facebook, twitter, snapchat, instagram } = props.socials;
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
};

export default SocialMedia;
