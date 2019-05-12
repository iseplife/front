import Button from '@material-ui/core/Button';
import { Box, Flex } from '@rebass/grid';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  Banner,
  Filler,
  FluidContent,
  Header,
  ScrollToTopOnMount,
  Text,
  Title,
} from '../../components/common';
import Loader from '../../components/Loader';
import Popup from '../../components/Popup';
import EditEventForm from './EditEventForm';
import { EventState, EventFilter } from '.';
import { EventCard } from './EventCard';
import { Event } from '../../data/media/type';

const EventsList = styled.ul`
  padding: 0;
  margin: 20px 0;
`;

type EventsViewProps = EventState & {
  editEvent: (event: Event) => void;
  saveEvent: (event: Event) => void;
  handleDeleteEvent: (ok: boolean) => void;
  deleteEvent: (event: Event) => void;
  closeEditEvent: () => void;
  onModifyFilter: (filter: EventFilter) => () => void;
};

export class EventsView extends Component<EventsViewProps> {
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
          <Flex alignItems="center">
            <Box>
              <Title invert fontSize={1.3}>
                Evènements{' '}
                {this.props.eventsFilter === 'next' ? 'à venir' : 'passés'}
              </Title>
            </Box>
            <Box flex="0 0 auto" ml="auto">
              <Button
                color="secondary"
                onClick={this.props.onModifyFilter('next')}
              >
                A venir
              </Button>
              <Button
                color="secondary"
                onClick={this.props.onModifyFilter('past')}
              >
                Passés
              </Button>
            </Box>
            <Box flex="0 0 auto" ml="10px">
              <Button
                color="primary"
                component={(props: any) => (
                  <NavLink to="/evenements/calendrier" {...props} />
                )}
              >
                Calendrier
              </Button>
            </Box>
          </Flex>
          <EventsList>
            <Loader loading={this.props.isLoading}>
              {this.props.events.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    minHeight: 300,
                    marginTop: 100,
                  }}
                >
                  <Text fs="2em">
                    Aucun évenement{' '}
                    {this.props.eventsFilter === 'next' ? 'à venir' : 'passés'}
                  </Text>
                </div>
              )}
              {this.props.events.map(e => {
                return (
                  <div key={e.id}>
                    <EventCard
                      event={e}
                      onEdit={this.props.editEvent}
                      onDelete={this.props.deleteEvent}
                    />
                  </div>
                );
              })}
            </Loader>
          </EventsList>
          <EditEventForm
            open={this.props.editOpen}
            saveEvent={this.props.saveEvent}
            event={this.props.selectedEvent}
            handleRequestClose={this.props.closeEditEvent}
          />
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
