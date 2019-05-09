// @flow

import React, { Component } from 'react';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';

import { Flex, Box } from 'grid-styled';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';
import Loader from 'components/Loader';

import {
  Banner,
  Filler,
  FluidContent,
  Header,
  SearchBar,
  ScrollToTopOnMount
} from 'components/common';

import * as eventData from '../../../data/event';

BigCalendar.momentLocalizer(moment);

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class CalendarEvents extends Component {

  state = {
    events: [],
    isLoading: false,
  }

  componentDidMount() {
    this.getEvents();
  }

  getEvents() {
    this.setState({ isLoading: true });
    eventData.getEvents().then(res => {
      const events = res.data.map(e => {
        return {
          title: e.title,
          allDay: true,
          start: new Date(e.date),
          end: new Date(e.date),
          desc: e.description,
        };
      });
      this.setState({ events, isLoading: false });
    });
  }

  render() {
    const { events, isLoading } = this.state;
    return (
      <div>
        <ScrollToTopOnMount />
        <Header url="/img/background.jpg">
          <Filler h={50} />
          <Banner>
            <h1>Evenements</h1>
            <p>Il faut parfois prendre une pause dans ses études...</p>
          </Banner>
          <FluidContent p="0">
            <SearchBar placeholder="Rechercher" />
          </FluidContent>
        </Header>
        <FluidContent>
          <Flex mb={2}>
            <Box ml="auto">
              <Button color="primary" component={NavLink} to="/evenements">Liste</Button>
            </Box>
          </Flex>
          <Loader loading={isLoading}>
            <BigCalendar
              events={events}
              views={allViews}
              step={60}
              style={{ height: 600 }}
              defaultDate={new Date()}
            />
          </Loader>
        </FluidContent>
      </div>
    );
  }
}

export default CalendarEvents;
