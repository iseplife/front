// @flow
import React from 'react';

import { Flex, Box } from 'grid-styled';
import {
  Paper,
  Title,
  Text,
  FluidContent,
  Image,
} from '../../components/common';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import StarIcon from '@material-ui/icons/Star';

import { Link, Switch, Route } from 'react-router-dom';
import Time from '../../components/Time';

import * as dorData from '../../data/dor';
import type { SessionDor } from '../../data/dor/type';

const btnStyle = {
  margin: 10,
};

const pollBtnStyle = {
  position: 'fixed',
  right: 0,
  bottom: 0,
  margin: 20,
  zIndex: 10,
};

type State = {
  sessionActive: ?SessionDor,
};

export default class IsepDorHome extends React.Component<{}, State> {
  state = {
    sessionActive: null,
  };

  componentDidMount() {
    dorData.getCurrentSession().then(res => {
      this.setState({
        sessionActive: res.data,
      });
    });
  }

  infoText(session: SessionDor) {
    const now = new Date().getTime();

    if (now < session.firstTurn) {
      return (
        <Text>
          <span>Ouverture des votes pour les ISEP d'Or le </span>
          <Time date={session.firstTurn} format="Do MMMM YYYY" /> !
        </Text>
      );
    }

    if (session.firstTurn < now && now < session.secondTurn) {
      return <Text>Les votes sont ouverts pour les ISEP d'Or !</Text>;
    }

    if (session.secondTurn < now && now < session.result) {
      return <Text>Votez pour le second tour d'ISEP d'Or !</Text>;
    }

    if (session.result < now) {
      return <Text>Les résultats d'ISEP d'Or sont disponibles !</Text>;
    }
    return null;
  }

  render() {
    const { sessionActive } = this.state;
    if (!sessionActive) {
      return null;
    }

    const now = new Date().getTime();
    return (
      <Paper p="2em">
        <Flex flexDirection={['column', 'row']}>
          <Box>
            <Title>ISEP d'Or</Title>
            {this.infoText(sessionActive)}
            <Box mt={2}>
              <Button
                style={btnStyle}
                variant="raised"
                color="primary"
                component={Link}
                to="/isepdor/poll"
                disabled={now < sessionActive.firstTurn}
              >
                {sessionActive.result > now ? 'Voter' : 'Résultats'}
              </Button>
            </Box>
          </Box>
          <Box p={1} ml={[0, 'auto']} mb={[2, 0]} order={[-1, 1]}>
            <Flex
              alignItems="center"
              justifyContent="center"
              style={{ height: '100%' }}
            >
              <img style={{ width: 100 }} src="/img/layout/trophy.png" alt="" />
            </Flex>
          </Box>
        </Flex>

        {sessionActive &&
          sessionActive.firstTurn < now && (
            <Tooltip title="ISEP d'Or" placement="left">
              <Button
                component={Link}
                to="/isepdor/poll"
                variant="fab"
                color="secondary"
                style={pollBtnStyle}
              >
                <StarIcon />
              </Button>
            </Tooltip>
          )}
      </Paper>
    );
  }
}
