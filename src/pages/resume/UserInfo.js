// @flow
import React from 'react';

import Time from '../../components/Time';

import {
  Text,
} from '../../components/common';

const InfoDescriptor = (props) => (
  <td style={{
    textAlign: 'right',
    fontWeight: 'bold',
    paddingRight: 10,
  }}>
    <Text>{props.label}</Text>
  </td>
);

const InfoValue = (props) => (
  <td style={{
    fontStyle: props.label ? 'normal' : 'italic'
  }}>
    {
      props.display &&
      <Text>
        {props.label ? props.display(props.label) : props.default}
      </Text>
    }
    {
      !props.display &&
      <Text>{props.label || props.default}</Text>
    }
  </td>
);

function UserInfo(props) {
  const user = props.user;
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
            display={(l) => <Time date={l} format="DD/MM/YYYY" />}
            default="Non renseignée" />
        </tr>
      </tbody>
    </table >
  );
}

export default UserInfo;
