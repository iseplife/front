// @flow

import React from 'react';
import styled from 'styled-components';
import { Flex } from 'grid-styled';

import { Link } from 'react-router-dom';

import { Image, ProfileImage } from '../common';

const Sub = styled.div`
  font-size: 15px;
  color: ${props => props.theme.main};
  text-align: right;
  margin-top: 10px;
`;

export default function Author(props) {
  const user = props.data;
  switch (user.authorType) {
    case 'club':
      return (
        <Link to={`/associations/${user.id}`}>
          <Flex flexDirection="column">
            <Image
              src={user.logoUrl}
              alt="logo-club"
              w="60px"
              h="60px"
              ml="auto"
            />
            <Sub>{user.name}</Sub>
          </Flex>
        </Link>
      );
    case 'student':
      return (
        <Flex flexDirection="column">
          <ProfileImage src={user.photoUrlThumb} sz="40px" ml="auto" />
          <Sub>
            {user.firstname}
            <br />
            {user.lastname}
          </Sub>
        </Flex>
      );
    default:
      break;
  }
  return null;
}
