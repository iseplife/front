import {
  AppBar,
  Avatar,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Toolbar,
} from '@material-ui/core';
import { ListItemProps } from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Box, Flex } from '@rebass/grid';
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Loader from '../../../../components/Loader';
import * as dorData from '../../../../data/dor';
import {
  AnswerDorScore,
  QuestionDor,
  SessionDor,
} from '../../../../data/dor/type';

const Index = styled.span`
  margin-right: 1em;
  font-size: 1.2em;
  font-weight: bold;
  color: #777;
`;

const Item = styled(ListItem as React.FC<ListItemProps>)`
  display: flex;
  align-items: center;
`;

const Score = styled.span`
  margin-left: auto;
`;
const Name = styled.span`
  margin-left: 1em;
  font-weight: bold;
`;

type AnswerItemProps = {
  answer: AnswerDorScore;
  index: number;
};
const AnswerItem: React.FC<AnswerItemProps> = ({ answer, index }) => {
  const data = dorData.getAnswerData(answer);
  return (
    <Fragment>
      <Item>
        <Index>#{index + 1}</Index>
        <Avatar src={data.url || ''} />
        <Name>{data.name}</Name>
        <Score>
          {answer.score} vote
          {answer.score != 1 && 's'}
        </Score>
      </Item>
      <Divider />
    </Fragment>
  );
};

type ResultPanelProps = {
  selected: SessionDor | null;
  title: string;
  open: boolean;
  handleClose: () => void;
};

type ResultPanelState = {
  questions: QuestionDor[];
  answers: AnswerDorScore[];
  tabSelected: number;
  roundSelected: number;
  selectedQuestion: number | null;
  loading: boolean;
};

class ResultPanel extends Component<ResultPanelProps, ResultPanelState> {
  state: ResultPanelState = {
    questions: [],
    answers: [],
    tabSelected: 0,
    roundSelected: 1,
    selectedQuestion: null,
    loading: false,
  };

  componentDidMount() {
    this.getQuestions();
  }

  async getQuestions() {
    const res = await dorData.getQuestions();
    this.setState({ questions: res.data });
  }

  async getAnswers(questionId: number | null, round: number) {
    const { selected } = this.props;
    if (selected && questionId) {
      this.setState({ loading: true });
      const res = await dorData.getRoundResultsForQuestion(
        selected.id,
        round,
        questionId
      );
      this.setState({ answers: res.data, loading: false });
    }
  }

  changeTab = (event: any, value: number) => {
    const round = value + 1;
    this.setState({ tabSelected: value, roundSelected: round });
    this.getAnswers(this.state.selectedQuestion, round);
  };

  handleClose = () => {
    this.setState({
      answers: [],
      selectedQuestion: null,
      roundSelected: 1,
      tabSelected: 0,
    });
    this.props.handleClose();
  };

  render() {
    const {
      selectedQuestion,
      tabSelected,
      answers,
      questions,
      loading,
    } = this.state;
    return (
      <Dialog open={this.props.open} fullScreen onClose={this.handleClose}>
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit">
              {this.props.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Flex flexWrap="wrap" style={{ height: '100%' }}>
          <Box
            width={[1, 1 / 4]}
            style={{ borderRight: 'solid 1px #ddd', overflow: 'auto' }}
          >
            <List>
              {questions.map(q => {
                return (
                  <Fragment key={q.id}>
                    <ListItem
                      button
                      style={{
                        background: q.id == selectedQuestion ? '#ccc' : '',
                      }}
                      onClick={() => {
                        this.setState({ selectedQuestion: q.id });
                        this.getAnswers(q.id, this.state.roundSelected);
                      }}
                    >
                      <ListItemText
                        primary={q.title}
                        secondary={'#' + q.position}
                      />
                    </ListItem>
                    <Divider />
                  </Fragment>
                );
              })}
            </List>
          </Box>
          <Box width={[1, 3 / 4]} style={{ overflow: 'auto' }}>
            {selectedQuestion && (
              <Fragment>
                <Tabs
                  value={tabSelected}
                  onChange={this.changeTab}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                >
                  <Tab label="1er tour" />
                  <Tab label="2ème tour" />
                </Tabs>
                {!loading && answers.length == 0 && (
                  <h2 style={{ margin: '1em' }}>Aucun résultat</h2>
                )}
                <Loader loading={loading}>
                  <List>
                    {answers.map((a, i) => (
                      <AnswerItem key={i} index={i} answer={a} />
                    ))}
                  </List>
                </Loader>
              </Fragment>
            )}
            {!selectedQuestion && (
              <h2 style={{ margin: '1em' }}>Séléctionnez une question</h2>
            )}
          </Box>
        </Flex>
      </Dialog>
    );
  }
}

export default ResultPanel;
