// @flow

import React from 'react';

import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

import {
  Banner,
  Filler,
  FluidContent,
  Header,
  Separator,
  Text,
  Title,
} from 'components/common';

import PostListView from 'components/PostList';
import Auth from 'components/Auth/AuthComponent';

import BookmarkIcon from '@material-ui/icons/Bookmark';
import SubjectIcon from '@material-ui/icons/Subject';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ScheduleIcon from '@material-ui/icons/Schedule';

import PublishBoxView from './publishBox';
import Loader from 'components/Loader';
import IsepDorHome from '../isepdor/Home';
import { ADMIN } from '../../constants';
import { BACKGROUND_COLOR, SECONDARY_COLOR } from '../../colors';

const PostSection = styled.div`
  margin: 30px 0;
`;

const Center = styled.div`
  text-align: center;
`;

const Circle = styled.div`
  display: inline-flex;
  align-items: center;
  justift-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const CircleIcon = props => (
  <Circle>
    <span
      style={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      {props.children}
    </span>
  </Circle>
);

export default function Home(props) {
  return (
    <div>
      <Header url="/img/background.jpg">
        <Filler h={50} />
        <Banner>
          <h1>Accueil</h1>
          <p>Bienvenue sur le site d'ISEPLive</p>
        </Banner>
        {/* <FluidContent p="0">
          <SearchBar placeholder="Rechercher" />
        </FluidContent> */}
      </Header>
      <div style={{ background: BACKGROUND_COLOR }}>
        <FluidContent>
          <Auth>
            <PublishBoxView refreshPosts={props.refreshPosts} />
            <Separator />
          </Auth>

          <Auth>
            <IsepDorHome />
          </Auth>

          <PostSection>
            <Loader loading={props.page === 0 && props.isLoading}>
              <div>
                {props.waitingPosts.length > 0 && (
                  <div>
                    <Flex align="center">
                      <Box mr="20px">
                        <CircleIcon>
                          <ScheduleIcon style={{ color: SECONDARY_COLOR }} />
                        </CircleIcon>
                      </Box>
                      <Box>
                        <Title invert mb="0" fontSize={2}>
                          En attente
                        </Title>
                      </Box>
                    </Flex>
                    <PostListView
                      canPin
                      posts={props.waitingPosts}
                      refreshPosts={props.refreshPosts}
                    />
                    <Filler h={50} />
                  </div>
                )}
                {props.pinnedPosts.length > 0 && (
                  <div>
                    <Flex align="center">
                      <Box mr="20px">
                        <CircleIcon>
                          <BookmarkIcon style={{ color: SECONDARY_COLOR }} />
                        </CircleIcon>
                      </Box>
                      <Box>
                        <Title invert mb="0" fontSize={2}>
                          A l'affiche
                        </Title>
                      </Box>
                    </Flex>
                    <PostListView
                      canPin
                      posts={props.pinnedPosts}
                      refreshPosts={props.refreshPosts}
                    />
                    <Filler h={50} />
                  </div>
                )}
                <Flex align="center">
                  <Box mr="20px">
                    <CircleIcon>
                      <SubjectIcon style={{ color: SECONDARY_COLOR }} />
                    </CircleIcon>
                  </Box>
                  <Box>
                    <Title invert mb="0" fontSize={2}>
                      Publications
                    </Title>
                  </Box>
                </Flex>
                {props.posts.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      minHeight: 300,
                      marginTop: 100,
                    }}
                  >
                    <Text fs="2em">Aucune publication</Text>
                  </div>
                )}
                <PostListView
                  canPin
                  posts={props.posts}
                  refreshPosts={props.refreshPosts}
                />
                {!props.lastPage &&
                  props.posts.length > 0 && (
                    <Center>
                      <Button
                        variant="fab"
                        color="primary"
                        disabled={props.isLoading}
                        onClick={props.onSeeMore}
                      >
                        <ArrowDownwardIcon />
                      </Button>
                    </Center>
                  )}
              </div>
            </Loader>
          </PostSection>
        </FluidContent>
      </div>
    </div>
  );
}
