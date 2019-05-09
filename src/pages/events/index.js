// @flow

import React, { Component } from 'react';

import EventView from './view';

import * as eventData from '../../data/event';

class Event extends Component {
  state = {
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

  modifyFilter = (eventsFilter: string) => e => {
    this.setState({ eventsFilter });
  };

  filterEvents = (events) => {
    const now = new Date().getTime();
    return events
      .filter(e =>
      this.state.eventsFilter === 'past' ? e.date < now : e.date > now)
      .sort((a, b) => a.date > b.date ? 1 : -1);
  };

  editEvent = (event) => {
    this.setState({ editOpen: true, selectedEvent: event });
  }

  saveEvent = (event) => {
    eventData.updateEvent(event.id, event).then(res => {
      this.fetchEvents();
      this.closeEditEvent();
    });
  }

  closeEditEvent = () => {
    this.setState({ editOpen: false, selectedEvent: null });
  }

  deleteEvent = (event) => {
    this.setState({ popupDelete: true, selectedEvent: event, editOpen: false });
  }

  handleDeleteEvent = (ok) => {
    if (ok) {
      eventData.deleteEvent(this.state.selectedEvent.id).then(res => {
        this.fetchEvents();
      });
    }
    this.setState({
      popupDelete: false,
      selectedEvent: null,
    });
  }

  render() {
    return (
      <EventView
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
        eventsFilter={this.state.eventsFilter} />
    );
  }
}

export default Event;
