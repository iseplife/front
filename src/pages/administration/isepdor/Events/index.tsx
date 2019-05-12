import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Paper } from '../../../../components/common';
import * as dorData from '../../../../data/dor';
import EventForm from './EventForm';
import { EventDor } from '../../../../data/dor/type';

type EventListState = {
  events: EventDor[];
  selectedEvent: EventDor | null;
};

class EventList extends React.Component<{}, EventListState> {
  state: EventListState = {
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
    let updateState: EventListState = { events: res.data, selectedEvent: null };
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
        <Box width={1 / 3} p={2}>
          <EventForm
            selected={selectedEvent}
            refreshTable={this.refreshTable}
            deselect={() => this.setState({ selectedEvent: null })}
          />
        </Box>

        <Box width={2 / 3} p={2}>
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
