import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Paper } from '../../../../components/common';
import * as dorData from '../../../../data/dor';
import QuestionForm from './QuestionForm';
import { QuestionDor } from '../../../../data/dor/type';

type QuestionListState = {
  questions: QuestionDor[];
  selectedQuestion: QuestionDor | null;
};

class QuestionList extends React.Component<{}, QuestionListState> {
  state: QuestionListState = {
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
    let updateState: QuestionListState = {
      questions: res.data,
      selectedQuestion: null,
    };
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
        <Box width={1 / 3} p={2}>
          <QuestionForm
            selected={selectedQuestion}
            refreshTable={this.refreshTable}
            deselect={() => this.setState({ selectedQuestion: null })}
          />
        </Box>

        <Box width={2 / 3} p={2}>
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
