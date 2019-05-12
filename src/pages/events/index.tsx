import React, { Component } from 'react';
import * as userData from '../../data/auth';
import * as eventData from '../../data/event';
import * as mediaTypes from '../../data/media/type';
import { EventsView } from './view';

type EventProps = {};
export type EventState = {
  events: mediaTypes.Event[];
  eventsFilter: EventFilter;
  isLoading: boolean;
  editOpen: boolean;
  popupDelete: boolean;
  selectedEvent: mediaTypes.Event | null;
};
export type EventFilter = 'next' | 'past';

class Event extends Component<EventProps, EventState> {
  state: EventState = {
    events: [],
    isLoading: false,
    eventsFilter: 'next',
    editOpen: false,
    popupDelete: false,
    selectedEvent: null,
  };

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.setState({ isLoading: true });
    eventData.getEvents().then(res => {
      this.setState({ events: res.data, isLoading: false });
    });
  }

  modifyFilter = (eventsFilter: EventFilter) => () => {
    this.setState({ eventsFilter });
  };

  filterEvents = (events: mediaTypes.Event[]) => {
    const now = new Date().getTime();
    return events
      .filter(e =>
        this.state.eventsFilter === 'past' ? e.date < now : e.date > now
      )
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  };

  editEvent = (event: mediaTypes.Event) => {
    this.setState({ editOpen: true, selectedEvent: event });
  };

  saveEvent = (event: mediaTypes.Event) => {
    const user = userData.getUser();
    if (user) {
      const id = eventData.updateEvent(event.id, event, user.id).then(() => {
        this.fetchEvents();
        this.closeEditEvent();
      });
    }
  };

  closeEditEvent = () => {
    this.setState({ editOpen: false, selectedEvent: null });
  };

  deleteEvent = (event: mediaTypes.Event) => {
    this.setState({ popupDelete: true, selectedEvent: event, editOpen: false });
  };

  handleDeleteEvent = (ok: boolean) => {
    if (ok && this.state.selectedEvent) {
      eventData.deleteEvent(this.state.selectedEvent.id).then(res => {
        this.fetchEvents();
      });
    }
    this.setState({
      popupDelete: false,
      selectedEvent: null,
    });
  };

  render() {
    return (
      <EventsView
        isLoading={this.state.isLoading}
        events={this.filterEvents(this.state.events)}
        editOpen={this.state.editOpen}
        selectedEvent={this.state.selectedEvent}
        popupDelete={this.state.popupDelete}
        onModifyFilter={this.modifyFilter}
        editEvent={this.editEvent}
        saveEvent={this.saveEvent}
        closeEditEvent={this.closeEditEvent}
        handleDeleteEvent={this.handleDeleteEvent}
        deleteEvent={this.deleteEvent}
        eventsFilter={this.state.eventsFilter}
      />
    );
  }
}

export default Event;
