import { Tab, Tabs } from '@material-ui/core';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import styled from 'styled-components';
import {
  FluidContent,
  Paper,
  ProfileImage,
  ScrollToTopOnMount,
  Title,
} from '../../../components/common';
import FullScreenView from '../../../components/FullScreen/View';
import Loader from '../../../components/Loader';
import SocialMedia from '../../../components/SocialMedia';
import { Student } from '../../../data/users/type';
import UserInfo from '../../resume/UserInfo';

const PersonStyle = styled.div`
  > div {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  width: 100%;
  height: 100%;
`;

type AdressbookDetailViewProps = {
  user: Student;
  isLoading: boolean;
  tabIndex: number;
  fullscreenOpen: boolean;
  setFullScreen: (fullscreenOpen: boolean) => () => void;
  changeTab: (event: React.ChangeEvent<{}>, value: any) => void;
  renderTab: () => React.ReactNode;
};

const AdressbookDetailView: React.FC<AdressbookDetailViewProps> = ({
  user,
  isLoading,
  tabIndex,
  fullscreenOpen,
  setFullScreen,
  changeTab,
  renderTab,
}) => {
  return (
    <FluidContent>
      <ScrollToTopOnMount />
      <Loader loading={isLoading}>
        {user && (
          <Flex flexWrap="wrap">
            <Box p={2} width={[1, 1 / 4]}>
              <PersonStyle
                onClick={setFullScreen(true)}
                style={{ cursor: 'pointer' }}
              >
                <ProfileImage
                  src={user.photoUrl}
                  alt="User main profile picture"
                  w="100%"
                  mh="200px"
                />
              </PersonStyle>
            </Box>
            <Box p={2} width={[1, 3 / 4]}>
              <Paper p="20px">
                <Flex>
                  <Box>
                    <Title>
                      {user.firstname} {user.lastname}
                    </Title>
                  </Box>
                </Flex>
                <UserInfo user={user} />
                <SocialMedia socials={user} />
              </Paper>
            </Box>
            <Box width={1}>
              <Tabs
                value={tabIndex}
                onChange={changeTab}
                indicatorColor="secondary"
                textColor="primary"
                centered
              >
                <Tab label="Compte" />
                <Tab label="Publications" />
                <Tab label="Photos" />
              </Tabs>
            </Box>
            {renderTab()}
            <FullScreenView
              visible={fullscreenOpen}
              image={user.photoUrl}
              onEscKey={setFullScreen(false)}
            />
          </Flex>
        )}
      </Loader>
    </FluidContent>
  );
};

export default AdressbookDetailView;
