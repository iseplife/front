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
import EmployeeForm from './EmployeeForm';

import type { Employee } from '../../../../data/users/type';
import * as userData from '../../../../data/users/student';

type State = {
  employees: Employee[],
  selectedEmployee: ?Employee,
};

class EventList extends React.Component<{}, State> {
  state = {
    employees: [],
    selectedEmployee: null,
  };

  componentDidMount() {
    this.refreshTable();
  }

  selectRow(id: number) {
    const event = this.state.employees.find(s => s.id === id);
    if (event) {
      this.setState({
        selectedEmployee: event,
      });
    }
  }

  refreshTable = async (id?: number) => {
    const res = await userData.getEmployees();
    let updateState = { employees: res.data };
    if (id) {
      const employee = res.data.find(s => s.id === id);
      if (employee) {
        updateState = { ...updateState, selectedEmployee: employee };
      }
    }
    this.setState(updateState);
  };

  renderRow = (employee: Employee) => {
    return (
      <TableRow
        key={employee.id}
        hover
        style={{ cursor: 'pointer' }}
        onClick={() => this.selectRow(employee.id)}
      >
        <TableCell>{employee.firstname}</TableCell>
        <TableCell>{employee.lastname}</TableCell>
      </TableRow>
    );
  };

  render() {
    const { employees, selectedEmployee } = this.state;
    return (
      <Flex p={2} flexWrap="wrap">
        <Box w={1 / 3} p={2}>
          <EmployeeForm
            selected={selectedEmployee}
            refreshTable={this.refreshTable}
            deselect={() => this.setState({ selectedEmployee: null })}
          />
        </Box>

        <Box w={2 / 3} p={2}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Nom</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{employees.map(this.renderRow)}</TableBody>
            </Table>
          </Paper>
        </Box>
      </Flex>
    );
  }
}

export default EventList;
