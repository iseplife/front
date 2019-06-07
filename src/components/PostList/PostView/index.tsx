import React from 'react';
import { Media } from '../../../data/media/type';
import { Post } from '../../../data/post/type';
import DocumentPost from './DocumentPost';
import EventPost from './EventPost';
import GalleryPost from './GalleryPost';
import GazettePost from './GazettePost';
import ImagePost from './ImagePost';
import PollPost from './PollPost';
import TextPost from './TextPost';
import VideoPost from './VideoPost';

export interface PostViewProps {
  preview?: boolean;
  invert?: boolean;
  list?: boolean;
  post: Post;
  openFullScreen?: (fullscreenOpen: boolean, media?: Media) => void;
  textView: (size: number[]) => React.ReactNode;
}

export const PostView: React.FC<PostViewProps> = props => {
  if (props.post.media) {
    switch (props.post.media.mediaType) {
      case 'poll':
        return <PollPost {...props} />;
      case 'image':
        return <ImagePost {...props} />;
      case 'video':
        return <VideoPost {...props} />;
      case 'gallery':
        return <GalleryPost {...props} />;
      case 'event':
        return <EventPost {...props} />;
      case 'document':
        return <DocumentPost {...props} />;
      case 'gazette':
        return <GazettePost {...props} />;
      default:
        break;
    }
  }

  return <TextPost {...props} />;
};
