import { Fab, Tab, Tabs } from '@material-ui/core';
import MUIButton, { ButtonProps } from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExploreAction from '@material-ui/icons/Explore';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import styled from 'styled-components';
import { ClubDetailState } from '.';
import { BACKGROUND_COLOR } from '../../../colors';
import {
  BgImage,
  FluidContent,
  ScrollToTopOnMount,
  Text,
  Title,
} from '../../../components/common';
import Popup from '../../../components/Popup';
import { ADMIN, CLUB_MANAGER } from '../../../constants';
import * as authData from '../../../data/auth';
import UpdateClubForm, { UpdateClubFormData } from './UpdateClubForm';

const Explore = styled(ExploreAction)`
  margin-right: 10px;
`;

type BtnProps = ButtonProps & { mt?: string };
const Button = styled<any>(MUIButton)`
  margin-top: ${(props: BtnProps) => props.mt || '0'};
`;

type ClubDetailViewProps = ClubDetailState & {
  changeTab: (event: React.ChangeEvent<{}>, value: any) => void;
  renderTab: () => React.ReactNode | null;
  onDelete: () => void;
  onEdit: () => void;
  updateClub: (form: UpdateClubFormData) => Promise<void>;
  closeForm: () => void;
  deleteAccepted: (accept: boolean) => void;
};
const ClubDetailView: React.FC<ClubDetailViewProps> = props => {
  return (
    <div style={{ background: BACKGROUND_COLOR }}>
      <ScrollToTopOnMount />
      <FluidContent>
        <Flex flexWrap="wrap">
          <Box width={[1, 1 / 4]} p={2}>
            <BgImage src={props.logoUrl} mh="150px" size="contain" />
          </Box>
          <Box width={[1, 3 / 4]} p={2}>
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
                  <ExploreAction /> Site internet
                </Button>
              </Box>
              {props.isAdmin && (
                <Box p={1}>
                  <Fab size="small" color="primary" onClick={props.onEdit}>
                    <EditIcon />
                  </Fab>
                </Box>
              )}
              {authData.hasRole([ADMIN, CLUB_MANAGER]) && (
                <Box p={1}>
                  <Fab size="small" color="secondary" onClick={props.onDelete}>
                    <DeleteIcon />
                  </Fab>
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
};

export default ClubDetailView;
