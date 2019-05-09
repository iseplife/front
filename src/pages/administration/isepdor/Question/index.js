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

import { Paper } from '../../../../components/common';
import QuestionForm from './QuestionForm';

import type { QuestionDor } from '../../../../data/dor/type';
import * as dorData from '../../../../data/dor';

type State = {
  questions: QuestionDor[],
  selectedQuestion: ?QuestionDor,
};

class QuestionList extends React.Component<{}, State> {
  state = {
    questions: [],
    selectedQuestion: null,
  };

  componentDidMount() {
    this.refreshTable();
  }

  selectRow(id: number) {
    const question = this.state.questions.find(s => s.id === id);
    if (question) {
      this.setState({
        selectedQuestion: question,
      });
    }
  }

  refreshTable = async (id?: number) => {
    const res = await dorData.getQuestions();
    let updateState = { questions: res.data };
    if (id) {
      const question = res.data.find(s => s.id === id);
      if (question) {
        updateState = { ...updateState, selectedQuestion: question };
      }
    }
    this.setState(updateState);
  };

  renderRow = (question: QuestionDor) => {
    const style = {
      marginRight: 5,
    };
    return (
      <TableRow
        key={question.id}
        hover
        style={{ cursor: 'pointer' }}
        onClick={() => this.selectRow(question.id)}
      >
        <TableCell>{question.position}</TableCell>
        <TableCell>{question.title}</TableCell>
        <TableCell>
          {question.enableStudent && <Chip style={style} label="Eleve" />}
          {question.enableEmployee && <Chip style={style} label="Employé" />}
          {question.enableClub && <Chip style={style} label="Association" />}
          {question.enableEvent && <Chip style={style} label="Evenement" />}
          {question.enableParty && <Chip style={style} label="Soirée" />}
        </TableCell>
      </TableRow>
    );
  };

  render() {
    const { questions, selectedQuestion } = this.state;
    return (
      <Flex p={2} flexWrap="wrap">
        <Box w={1 / 3} p={2}>
          <QuestionForm
            selected={selectedQuestion}
            refreshTable={this.refreshTable}
            deselect={() => this.setState({ selectedQuestion: null })}
          />
        </Box>

        <Box w={2 / 3} p={2}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Titre</TableCell>
                  <TableCell>Réponses</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{questions.map(this.renderRow)}</TableBody>
            </Table>
          </Paper>
        </Box>
      </Flex>
    );
  }
}

export default QuestionList;
