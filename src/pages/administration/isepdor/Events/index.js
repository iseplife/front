// @flow
import React from 'react';

import { Flex, Box } from 'grid-styled';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Checkbox from '@material-ui/core/Checkbox';

import { Paper } from '../../../../components/common';
import EventForm from './EventForm';

import type { EventDor } from '../../../../data/dor/type';
import * as dorData from '../../../../data/dor';

type State = {
  events: EventDor[],
  selectedEvent: ?EventDor,
};

class EventList extends React.Component<{}, State> {
  state = {
    events: [],
    selectedEvent: null,
  };

  componentDidMount() {
    this.refreshTable();
  }

  selectRow(id: number) {
    const event = this.state.events.find(s => s.id === id);
    if (event) {
      this.setState({
        selectedEvent: event,
      });
    }
  }

  refreshTable = async (id?: number) => {
    const res = await dorData.getEvents();
    let updateState = { events: res.data };
    if (id) {
      const event = res.data.find(s => s.id === id);
      if (event) {
        updateState = { ...updateState, selectedEvent: event };
      }
    }
    this.setState(updateState);
  };

  renderRow = (event: EventDor) => {
    return (
      <TableRow
        key={event.id}
        hover
        style={{ cursor: 'pointer' }}
        onClick={() => this.selectRow(event.id)}
      >
        <TableCell>{event.name}</TableCell>
        <TableCell>
          <Checkbox checked={event.party} disableRipple />
        </TableCell>
      </TableRow>
    );
  };

  render() {
    const { events, selectedEvent } = this.state;
    return (
      <Flex p={2} flexWrap="wrap">
        <Box w={1 / 3} p={2}>
          <EventForm
            selected={selectedEvent}
            refreshTable={this.refreshTable}
            deselect={() => this.setState({ selectedEvent: null })}
          />
        </Box>

        <Box w={2 / 3} p={2}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Soirée</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{events.map(this.renderRow)}</TableBody>
            </Table>
          </Paper>
        </Box>
      </Flex>
    );
  }
}

export default EventList;
