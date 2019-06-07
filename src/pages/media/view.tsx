import { Fab } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Box, Flex } from '@rebass/grid';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Banner,
  Filler,
  FluidContent,
  Header,
  Separator,
  Text,
} from '../../components/common';
import Loader from '../../components/Loader';
import Time from '../../components/Time';
import * as mediaTypes from '../../data/media/type';
import { Album, Gazette, Video } from './mediaViews';

const Title = styled.h2`
  margin-right: 20px;
  color: ${props => props.theme.main};
  text-transform: capitalize;
`;

type DateSeparatorProps = { date: React.ReactNode };
const DateSeparator: React.FC<DateSeparatorProps> = props => {
  return (
    <Flex alignItems="center">
      <Box flex="0 0 auto" mr="20px">
        <Title>{props.date}</Title>
      </Box>
      <Box flex="1 1 auto">
        <Separator m="0" />
      </Box>
    </Flex>
  );
};

const now = new Date().getFullYear();
let years = [];
for (var i = 1; i < 6; i++) {
  years.push(now + i);
}

type MediaViewProps = {
  medias: {
    date: Date;
    medias: mediaTypes.Media[];
  }[];
  isLoading: boolean;
  lastPage: boolean;
  seeMore: () => void;
};
type MediaViewState = {
  photos: boolean;
  videos: boolean;
  gazettes: boolean;
  year: number[];
};

type MediaViewTypes = 'gallery' | 'video' | 'gazette';

class MediaView extends Component<MediaViewProps, MediaViewState> {
  state: MediaViewState = {
    photos: true,
    videos: true,
    gazettes: true,
    year: [],
  };

  handleChange = (name: keyof MediaViewState) => (
    event: any,
    checked: boolean
  ) => {
    this.setState({ [name]: checked } as any);
  };

  filterMedia(mediaType: MediaViewTypes) {
    const { photos, videos, gazettes } = this.state;
    switch (mediaType) {
      case 'gallery':
        return photos;
      case 'video':
        return videos;
      case 'gazette':
        return gazettes;
      default:
        break;
    }
    return true;
  }

  processMediaList() {
    return this.props.medias
      .map(mg => {
        const medias = mg.medias.filter(m =>
          this.filterMedia(m.mediaType as MediaViewTypes)
        );
        return { ...mg, medias };
      })
      .filter(mg => mg.medias.length > 0);
  }

  renderMediaComponent(media: mediaTypes.Media) {
    switch (media.mediaType) {
      case 'video':
        return (
          <Link to={`/post/${media.postId}`}>
            <Video {...media} />
          </Link>
        );
      case 'gallery':
        return (
          <Album
            url={media.coverImage ? media.coverImage.thumbUrl : null}
            {...media}
          />
        );
      case 'gazette':
        return (
          <Link to={`/post/${media.postId}`}>
            <Gazette {...media} />
          </Link>
        );
      default:
        break;
    }
    return;
  }

  render() {
    return (
      <div>
        <Header url="/img/background.jpg">
          <Filler h={50} />
          <Banner>
            <h1>Media</h1>
            <p>Retrouvez photos, vidéos, gazettes de tous les évenements !</p>
          </Banner>
          {/* <FluidContent p="0">
            <SearchBar placeholder="Rechercher des medias" />
          </FluidContent> */}
        </Header>
        <FluidContent>
          <Flex alignItems="center" flexWrap="wrap">
            <Box mb={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.photos}
                    onChange={this.handleChange('photos')}
                  />
                }
                label="Photos"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.videos}
                    onChange={this.handleChange('videos')}
                  />
                }
                label="Vidéos"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.gazettes}
                    onChange={this.handleChange('gazettes')}
                  />
                }
                label="Gazettes"
              />
            </Box>
            {/* <Box mb={2}>
              <div style={STYLE_CONTAINER}>
                <FormControl style={STYLE_FORMCONTROL}>
                  <InputLabel htmlFor="year-multiple">Années</InputLabel>
                  <Select
                    multiple
                    value={this.state.year}
                    onChange={this.handleChange}
                    input={<Input id="year-multiple" />}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                          width: 200,
                        },
                      },
                    }}
                  >
                    {years.map(year => (
                      <MenuItem
                        key={year}
                        value={year}
                        style={{
                          fontWeight: this.state.year.indexOf(year) !== -1 ? '500' : '400',
                        }}
                      >
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Sélection multiple</FormHelperText>
                </FormControl>
              </div>
            </Box> */}
          </Flex>
          <Loader loading={this.props.isLoading}>
            {this.processMediaList().length === 0 && (
              <div
                style={{ textAlign: 'center', minHeight: 300, marginTop: 100 }}
              >
                <Text fs="2em">Aucun media</Text>
              </div>
            )}
            {this.processMediaList().map(m => {
              return (
                <div key={m.date.toString()}>
                  <DateSeparator
                    date={<Time date={m.date.getTime()} format="MMMM YYYY" />}
                  />
                  <Flex flexWrap="wrap">
                    {m.medias.map(e => {
                      return (
                        <Box key={e.id} width={[1, 1 / 2, 1 / 3]} p={2}>
                          {this.renderMediaComponent(e)}
                        </Box>
                      );
                    })}
                  </Flex>
                </div>
              );
            })}
            {!this.props.lastPage && (
              <div style={{ textAlign: 'center' }}>
                <Fab color="primary" onClick={this.props.seeMore}>
                  <ArrowDownwardIcon />
                </Fab>
              </div>
            )}
          </Loader>
        </FluidContent>
      </div>
    );
  }
}

export default MediaView;
