// @flow

import React from 'react';

import { Box, Flex } from 'grid-styled';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom';

import { Paper, Text, Title, BgImage } from 'components/common';

import * as clubData from '../../data/club';

export default function AccountTab(props) {
  const { data, clubMembers } = props;
  const { bio, allowNotifications } = data;
  return (
    <div style={{ width: '100%' }}>
      {props.parameters && (
        <Box p={2} width={1}>
          <Paper p="20px">
            <Title fontSize={1.3} invert>
              Parametres
            </Title>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowNotifications}
                    onChange={props.toggleNotif}
                  />
                }
                label="Notification lorsqu'une association publie un post."
              />
            </div>
          </Paper>
        </Box>
      )}
      <Box p={2} width={1}>
        <Paper p="20px">
          <Title fontSize={1.3} invert>
            Citation
          </Title>
          <Text>{bio || <i>Pas de bio</i>}</Text>
        </Paper>
      </Box>
      <Box p={2} width={1}>
        <Title fontSize={1.5} invert>
          Associations
        </Title>
        {clubMembers.length === 0 && <Text>Membre d'aucune association</Text>}
        <Flex flexWrap="wrap">
          {clubMembers.map(cm => {
            return (
              <Box w={[1, 1 / 3, 1 / 4]} key={cm.club.id} p={2}>
                <Link to={`/associations/${cm.club.id}`}>
                  <Paper>
                    <BgImage src={cm.club.logoUrl} mh="200px" />
                    <div style={{ textAlign: 'center', padding: '.5em' }}>
                      <div>
                        <Title invert fontSize={1.5}>
                          {cm.club.name}
                        </Title>
                      </div>
                      <Title fontSize={1.1}>
                        {clubData.getClubRoleName(cm.role.name)}
                      </Title>
                    </div>
                  </Paper>
                </Link>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </div>
  );
}
