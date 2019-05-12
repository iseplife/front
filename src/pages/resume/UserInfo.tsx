import React from 'react';
import styled from 'styled-components';
import { Text } from '../../components/common';
import Time from '../../components/Time';
import { Student } from '../../data/users/type';

const InfoDescriptorStyle = styled.td`
  text-align: right;
  font-weight: bold;
  padding-right: 10px;
`;

type InfoDescriptorProps = {
  label: string;
};
const InfoDescriptor: React.FC<InfoDescriptorProps> = props => (
  <InfoDescriptorStyle>
    <Text>{props.label}</Text>
  </InfoDescriptorStyle>
);

type InfoValueProps = {
  label?: any;
  default: string;
  display?: (value: any) => React.ReactNode;
};
const InfoValue: React.FC<InfoValueProps> = props => (
  <td style={{ fontStyle: props.label ? 'normal' : 'italic' }}>
    {props.display && (
      <Text>{props.label ? props.display(props.label) : props.default}</Text>
    )}
    {!props.display && <Text>{props.label || props.default}</Text>}
  </td>
);

type UserInfoProps = {
  user: Student;
};
const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <table>
      <tbody>
        <tr>
          <InfoDescriptor label="Promotion" />
          <InfoValue label={user.promo} default="Non renseigné" />
        </tr>
        <tr>
          <InfoDescriptor label="Numéro ISEP" />
          <InfoValue label={user.studentId} default="Non renseigné" />
        </tr>
        <tr>
          <InfoDescriptor label="Téléphone" />
          <InfoValue label={user.phone} default="Non renseigné" />
        </tr>
        <tr>
          <InfoDescriptor label="Adresse" />
          <InfoValue label={user.address} default="Non renseignée" />
        </tr>
        <tr>
          <InfoDescriptor label="Mail" />
          <InfoValue label={user.mail} default="Non renseigné" />
        </tr>
        <tr>
          <InfoDescriptor label="Mail ISEP" />
          <InfoValue label={user.mailISEP} default="Non renseigné" />
        </tr>
        <tr>
          <InfoDescriptor label="Date de naissance" />
          <InfoValue
            label={user.birthDate}
            display={birthDate => (
              <Time date={birthDate as number} format="DD/MM/YYYY" />
            )}
            default="Non renseignée"
          />
        </tr>
      </tbody>
    </table>
  );
};

export default UserInfo;
