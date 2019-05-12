import Button from '@material-ui/core/Button';
import { Box, Flex } from '@rebass/grid';
import moment from 'moment';
import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { NavLink } from 'react-router-dom';
import {
  Banner,
  Filler,
  FluidContent,
  Header,
  ScrollToTopOnMount,
  SearchBar,
} from '../../../components/common';
import Loader from '../../../components/Loader';
import * as eventData from '../../../data/event';

const localizer = BigCalendar.momentLocalizer(moment);

const allViews = [
  BigCalendar.Views.AGENDA,
  BigCalendar.Views.DAY,
  BigCalendar.Views.MONTH,
  BigCalendar.Views.WEEK,
  BigCalendar.Views.WORK_WEEK,
];

class CalendarEvents extends Component {
  state = {
    events: [],
    isLoading: false,
  };

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
              <Button
                color="primary"
                component={(props: any) => (
                  <NavLink to="/evenements" {...props} />
                )}
              >
                Liste
              </Button>
            </Box>
          </Flex>
          <Loader loading={isLoading}>
            <BigCalendar
              events={events}
              views={allViews}
              step={60}
              localizer={localizer}
              defaultDate={new Date()}
            />
          </Loader>
        </FluidContent>
      </div>
    );
  }
}

export default CalendarEvents;
