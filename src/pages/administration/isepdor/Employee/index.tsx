import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Paper } from '../../../../components/common';
import * as userData from '../../../../data/users/student';
import { Employee } from '../../../../data/users/type';
import EmployeeForm from './EmployeeForm';

type EventListState = {
  employees: Employee[];
  selectedEmployee: Employee | null;
};

class EventList extends React.Component<{}, EventListState> {
  state: EventListState = {
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
    let updateState: EventListState = {
      employees: res.data,
      selectedEmployee: null,
    };
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
        <Box width={1 / 3} p={2}>
          <EmployeeForm
            selected={selectedEmployee}
            refreshTable={this.refreshTable}
            deselect={() => this.setState({ selectedEmployee: null })}
          />
        </Box>

        <Box width={2 / 3} p={2}>
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
