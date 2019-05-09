// @flow

import React from 'react';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Flex, Box } from 'grid-styled';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import { DatePicker } from 'material-ui-pickers';

import { Title, Paper } from '../../../../components/common';
import Time from '../../../../components/Time';

import * as dorData from '../../../../data/dor';
import type {
  SessionDor,
  SessionDorCreate,
  AnswerDorScore,
} from '../../../../data/dor/type';

import SessionForm from './SessionForm';

type State = {
  sessions: SessionDor[],
  selectedSession: ?SessionDor,
  create: boolean,
  showResults: boolean,
};

export default class Session extends React.Component<{}, State> {
  state = {
    sessions: [],
    selectedSession: null,
    create: true,
  };

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = async (id: ?number) => {
    const res = await dorData.getSessions();
    let updateState = { sessions: res.data };
    if (id) {
      const session = res.data.find(s => s.id === id);
      if (session) {
        updateState = { ...updateState, selectedSession: session };
      }
    }
    this.setState(updateState);
  };

  selectRow = (id: number) => (e: any) => {
    const session = this.state.sessions.find(s => s.id === id);
    if (session) {
      this.setState({
        selectedSession: session,
        create: false,
      });
    }
  };

  renderTableCell = (session: SessionDor) => {
    return (
      <TableRow
        key={session.id}
        hover
        style={{ cursor: 'pointer' }}
        onClick={this.selectRow(session.id)}
      >
        <TableCell>
          <Time date={session.firstTurn} format="DD/MM/YY" />
        </TableCell>
        <TableCell>
          <Time date={session.secondTurn} format="DD/MM/YY" />
        </TableCell>
        <TableCell>
          <Time date={session.result} format="DD/MM/YY" />
        </TableCell>
        <TableCell>
          <Checkbox disableRipple checked={session.enabled} />
        </TableCell>
      </TableRow>
    );
  };

  render() {
    const { sessions, selectedSession, create } = this.state;
    return (
      <Flex p={2} flexWrap="wrap">
        <Box w={1 / 3} p={2}>
          <SessionForm
            selected={selectedSession}
            refreshTable={this.refreshTable}
            deselect={() =>
              this.setState({
                selectedSession: null,
              })
            }
          />
        </Box>

        <Box w={2 / 3} p={2}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>1er tour</TableCell>
                  <TableCell>2e tour</TableCell>
                  <TableCell>Resultats</TableCell>
                  <TableCell>Actif</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{sessions.map(this.renderTableCell)}</TableBody>
            </Table>
          </Paper>
        </Box>
      </Flex>
    );
  }
}
