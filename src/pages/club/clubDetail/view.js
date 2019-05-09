// @flow

import React from 'react';

import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

import { Tabs, Tab } from '@material-ui/core';
import MUIButton from '@material-ui/core/Button';
import ExploreAction from '@material-ui/icons/Explore';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import {
  FluidContent,
  BgImage,
  Text,
  Title,
  ScrollToTopOnMount,
} from 'components/common';

import Popup from 'components/Popup';

import { BACKGROUND_COLOR, MAIN_COLOR, SECONDARY_COLOR } from '../../../colors';
import * as authData from '../../../data/auth';
import { ADMIN, CLUB_MANAGER } from '../../../constants';
import UpdateClubForm from './UpdateClubForm';

const Explore = styled(ExploreAction)`
  margin-right: 10px;
`;

const Button = styled(MUIButton)`
  margin-top: ${props => props.mt || '0'};
`;

export default function ClubDetailView(props) {
  return (
    <div style={{ background: BACKGROUND_COLOR }}>
      <ScrollToTopOnMount />
      <FluidContent>
        <Flex flexWrap="wrap">
          <Box w={[1, 1 / 4]} p={2}>
            <BgImage src={props.logoUrl} mh="150px" size="contain" />
          </Box>
          <Box w={[1, 3 / 4]} p={2}>
            <Title invert>{props.name}</Title>
            <Text>{props.description}</Text>
            <Flex mt="15px" flexWrap="wrap">
              <Box p={1}>
                <Button
                  href={props.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="secondary"
                >
                  <Explore /> Site internet
                </Button>
              </Box>
              {props.isAdmin && (
                <Box p={1}>
                  <Button
                    variant="fab"
                    mini
                    color="primary"
                    onClick={props.onEdit}
                  >
                    <EditIcon />
                  </Button>
                </Box>
              )}
              {authData.hasRole([ADMIN, CLUB_MANAGER]) && (
                <Box p={1}>
                  <Button
                    variant="fab"
                    mini
                    color="secondary"
                    onClick={props.onDelete}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              )}
            </Flex>
          </Box>
        </Flex>
        <UpdateClubForm
          title="Modifier l'association"
          open={props.formOpen}
          form={props.formData}
          handleRequestClose={props.closeForm}
          onSave={props.updateClub}
        />
        <Popup
          title="Suppression"
          description="Voulez vous supprimer cette Association ?"
          open={props.openDeletePopup}
          onRespond={props.deleteAccepted}
        />
      </FluidContent>
      <Tabs
        value={props.tabIndex}
        onChange={props.changeTab}
        indicatorColor="secondary"
        textColor="primary"
        centered
      >
        <Tab label="Membres" />
        <Tab label="Publications" />
        {props.isAdmin && <Tab label="Admin" />}
      </Tabs>
      <FluidContent>{props.renderTab()}</FluidContent>
    </div>
  );
}
