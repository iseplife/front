import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ProfileImage, Text } from '../../../components/common';
import Loader from '../../../components/Loader';
import * as authData from '../../../data/auth';
import * as clubData from '../../../data/club';
import { ClubMember } from '../../../data/club/type';

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

type MemberProps = {
  url?: string;
  name: string;
  promotion: number;
  role: string;
};
const Member: React.FC<MemberProps> = props => {
  return (
    <MemberStyle>
      <ProfileImage
        src={props.url}
        alt="Club member profile image"
        w="100%"
        mh="200px"
      />
      <div>
        <p className="name">{props.name}</p>
        <p>Promo {props.promotion}</p>
        <p className="role">{props.role}</p>
      </div>
    </MemberStyle>
  );
};

type MembersTabProps = {
  loading: boolean;
  members: ClubMember[];
};
const MembersTab: React.FC<MembersTabProps> = props => {
  return (
    <Loader loading={props.loading}>
      <Flex flexWrap="wrap" style={{ minHeight: 400 }}>
        {props.members.length === 0 && <Text>Aucun membre</Text>}
        {props.members.map(m => {
          return (
            <Box key={m.id} width={[1, 1 / 3, 1 / 5]} p={2}>
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
};

export default MembersTab;
