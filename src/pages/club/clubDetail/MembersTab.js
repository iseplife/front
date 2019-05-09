// @flow

import React from 'react';

import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

import { Link } from 'react-router-dom';

import { ProfileImage, Text } from 'components/common';
import Loader from 'components/Loader';
import * as clubData from '../../../data/club';
import * as authData from '../../../data/auth';

const MemberStyle = styled.div`
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  > div {
    padding: 10px;
    color: ${props => props.theme.main};
  }

  > div p {
    margin: 0;
  }

  > div p.name {
    font-weight: 500;
    margin-bottom: 5px;
  }

  .role {
    margin-top: 5px;
    font-weight: 500;
    color: ${props => props.theme.accent};
  }
`;

const Member = props => {
  return (
    <MemberStyle>
      <ProfileImage src={props.url} sz="100%" mh="200px" />
      <div>
        <p className="name">{props.name}</p>
        <p>Promo {props.promotion}</p>
        <p className="role">{props.role}</p>
      </div>
    </MemberStyle>
  );
};

export default function MembersTab(props) {
  return (
    <Loader loading={props.loading}>
      <Flex flexWrap="wrap" style={{ minHeight: 400 }}>
        {props.members.length === 0 && <Text>Aucun membre</Text>}
        {props.members.map(m => {
          return (
            <Box key={m.id} w={[1, 1 / 3, 1 / 5]} p={2}>
              {authData.isLoggedIn() ? (
                <Link to={`/annuaire/${m.member.id}`}>
                  <Member
                    url={m.member.photoUrlThumb}
                    name={m.member.firstname + ' ' + m.member.lastname}
                    role={clubData.getClubRoleName(m.role.name)}
                    promotion={m.member.promo}
                  />
                </Link>
              ) : (
                <Member
                  url={m.member.photoUrlThumb}
                  name={m.member.firstname + ' ' + m.member.lastname}
                  role={clubData.getClubRoleName(m.role.name)}
                  promotion={m.member.promo}
                />
              )}
            </Box>
          );
        })}
      </Flex>
    </Loader>
  );
}
