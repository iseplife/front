import { Flex } from '@rebass/grid';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as userTypes from '../../data/users/type';
import { Image, ProfileImage } from '../common';

const Sub = styled.div`
  font-size: 15px;
  color: ${props => props.theme.main};
  text-align: right;
  margin-top: 10px;
`;

interface AuthorProps {
  data: userTypes.Author;
}

const Author: React.FC<AuthorProps> = ({ data: user }) => {
  switch (user.authorType) {
    case 'club':
      const club = user as userTypes.Club;
      return (
        <Link to={`/associations/${club.id}`}>
          <Flex flexDirection="column">
            <Image src={club.logoUrl} alt="Club logo" w={60} h={60} ml="auto" />
            <Sub>{club.name}</Sub>
          </Flex>
        </Link>
      );
    case 'student':
      const student = user as userTypes.Student;
      return (
        <Flex flexDirection="column">
          <ProfileImage
            src={student.photoUrlThumb}
            alt="Student profile image"
            w="40px"
            ml="auto"
          />
          <Sub>
            {student.firstname}
            <br />
            {student.lastname}
          </Sub>
        </Flex>
      );
    default:
      break;
  }
  return null;
};

export default Author;
