// @flow

import React, { Component } from 'react';

import styled from 'styled-components';

import { Box, Flex } from 'grid-styled';

import {
  Banner,
  Filler,
  FluidContent,
  Header,
  Text,
  Title,
  ScrollToTopOnMount,
} from '../../components/common';

import Button from '@material-ui/core/Button';

import { NavLink } from 'react-router-dom';

import Loader from 'components/Loader';

import Popup from '../../components/Popup';

import EditEventForm from './EditEventForm';
import Event from './Event';

const EventsList = styled.ul`
  padding: 0;
  margin: 20px 0;
`;

export default class Events extends Component {
  render() {
    return (
      <div>
        <ScrollToTopOnMount />
        <Header url="/img/background.jpg">
          <Filler h={50} />
          <Banner>
            <h1>Evenements</h1>
            <p>Il faut parfois prendre une pause dans ses études...</p>
          </Banner>
          {/* <FluidContent p="0">
            <SearchBar placeholder="Rechercher des évenements" />
          </FluidContent> */}
        </Header>
        <FluidContent>
          <Flex align="center">
            <Box>
              <Title invert fontSize={1.3}>Evènements {this.props.eventsFilter === 'next' ? 'à venir' : 'passés'}</Title>
            </Box>
            <Box flex="0 0 auto" ml="auto">
              <Button color="secondary" onClick={this.props.onModifyFilter('next')}>A venir</Button>
              <Button color="secondary" onClick={this.props.onModifyFilter('past')}>Passés</Button>
            </Box>
            <Box flex="0 0 auto" ml="10px">
              <Button color="primary" component={NavLink} to="/evenements/calendrier">Calendrier</Button>
            </Box>
          </Flex>
          <EventsList>
            <Loader loading={this.props.isLoading}>
              {
                this.props.events.length === 0 &&
                <div style={{ textAlign: 'center', minHeight: 300, marginTop: 100 }}>
                  <Text fs="2em">Aucun évenement {this.props.eventsFilter === 'next' ? 'à venir' : 'passés'}</Text>
                </div>
              }
              {
                this.props.events.map(e => {
                  return (
                    <div key={e.id}>
                      <Event
                        event={e}
                        onEdit={this.props.editEvent}
                        onDelete={this.props.deleteEvent} />
                    </div>
                  );
                })
              }
            </Loader>
          </EventsList>
          <EditEventForm
            open={this.props.editOpen}
            saveEvent={this.props.saveEvent}
            event={this.props.selectedEvent}
            handleRequestClose={this.props.closeEditEvent} />
          <Popup
            open={this.props.popupDelete}
            title="Voulez vous supprimer cet événement ?"
            description="Supprimer cette événement entrainera la suppression du post associé."
            onRespond={this.props.handleDeleteEvent}
          />
        </FluidContent>
      </div>
    );
  }
}
