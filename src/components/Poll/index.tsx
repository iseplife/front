import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import { Box, Flex } from '@rebass/grid';
import moment from 'moment';
import React, { Component } from 'react';
import styled, { StyledProps } from 'styled-components';
import * as authData from '../../data/auth';
import * as pollData from '../../data/media/poll';
import {
  Media,
  Poll as PollType,
  PollAnswer,
  PollVote,
} from '../../data/media/type';
import { ProfileImage, Text, Title } from '../common';

const Wrapper = styled.div`
  background: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
`;

const TopBar = styled.div`
  background: ${props => props.theme.main};
  padding: 15px;
  font-size: 25px;
  font-weight: 500;
  width: 100%;
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.accent};
`;

const Question = styled.h1`
  color: ${props => props.theme.main};
  margin: 0;
  margin-bottom: 20px;
  font-size: 20px;
`;

const Main = styled.div`
  padding: 20px;
`;

const Caption = styled.p`
  margin: 0;
  color: ${props => props.theme.main};
  font-size: 15px;
  text-align: right;
  cursor: pointer;
`;

interface PollProps {
  data: Media;
}

type PollState = {
  showVote: boolean;
  answers: PollAnswer[];
  data: PollType;
  showVotesModal: boolean;
};

class Poll extends Component<PollProps, PollState> {
  state: PollState = {
    showVote: false,
    answers: [],
    data: this.props.data as PollType,
    showVotesModal: false,
  };

  componentDidUpdate(prevProps: PollProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ data: this.props.data as PollType });
    }
  }

  componentDidMount() {
    if (this.hasEnded()) {
      this.setState({ showVote: true });
    }

    if (!authData.isLoggedIn()) {
      this.setState({ showVote: true });
      return;
    }
    this.retrieveVotes();
  }

  retrieveVotes() {
    pollData.getVotes(this.state.data.id).then(res => {
      if (res.data.length > 0) {
        this.setState({
          showVote: true,
          answers: res.data.map(d => d.answer),
        });
      }
    });
  }

  hasEnded = () => {
    return this.state.data.endDate < Date.now();
  };

  handleVote = async (choice: PollAnswer) => {
    if (this.hasEnded()) {
      this.setState({ showVote: true });
      return;
    }

    if (!this.isSelectable(choice)) return;

    const { data: poll } = this.state;
    const user = authData.getUser();
    if (!user) return;

    if (choice.voters.includes(user.id)) {
      await pollData.removeVote(poll.id, choice);
    } else {
      await pollData.vote(poll.id, choice.id);
    }

    let res = await pollData.getPoll(this.props.data.id);
    this.setState({ data: res.data });
    this.retrieveVotes();
  };

  isAnswered(answer: PollAnswer): boolean {
    const user = authData.getUser();
    if (user) {
      return answer.voters.filter(vid => vid === user.id).length > 0;
    }
    return false;
  }

  isSelectable(answer: PollAnswer) {
    if (this.hasEnded()) {
      return false;
    }

    if (!this.state.data.multiAnswers && this.isAnswered(answer)) {
      return false;
    }

    return true;
  }

  getTotal() {
    const poll = this.state.data;
    return poll.answers.reduce((acc, x) => acc + x.votesNb, 0);
  }

  renderPollStatus() {
    const { data: poll } = this.state;
    if (this.hasEnded()) {
      return (
        'Sondage terminé le ' +
        moment(poll.endDate).format('Do MMMM YYYY [à] HH:mm')
      );
    } else {
      const remainDate = moment(poll.endDate).fromNow();
      return `Fini ${remainDate}`;
    }
  }

  render() {
    const poll = this.state.data;
    const total = this.getTotal();
    return (
      <Wrapper>
        <TopBar>
          <InsertChartIcon style={{ marginRight: 10 }} /> Sondage
        </TopBar>
        <Main>
          <Question>{poll.name}</Question>
          {poll.answers.map(ans => {
            return (
              <Answer
                key={ans.id}
                showVote={this.state.showVote || this.hasEnded()}
                selectable={this.isSelectable(ans)}
                voted={this.isAnswered(ans)}
                multiAnswers={poll.multiAnswers}
                total={this.getTotal()}
                ended={this.hasEnded()}
                onClick={() => this.handleVote(ans)}
                answer={ans}
              />
            );
          })}
          {poll.multiAnswers && (
            <Text fs="0.8em" mb={0.5}>
              Plusieurs réponses possibles
            </Text>
          )}
          <Flex>
            <Box>
              <Text fs="0.9em">{this.renderPollStatus()}</Text>
            </Box>
            <Box ml="auto">
              {this.state.showVote && (
                <Caption
                  onClick={() => {
                    this.setState({ showVotesModal: true });
                  }}
                >
                  {total} vote
                  {total !== 1 && 's'}
                </Caption>
              )}
            </Box>
          </Flex>
        </Main>
        <VotesList
          open={this.state.showVotesModal}
          pollid={poll.id}
          handleRequestClose={() => {
            this.setState({ showVotesModal: false });
          }}
        />
      </Wrapper>
    );
  }
}

export default Poll;

type AnswerStyleProps = { selectable: boolean };
const AnswerStyle = styled.div`
  position: relative;
  background: rgba(63, 81, 181, 0.6);
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
  transition: background 0.3s ease;

  &:hover {
    ${(props: AnswerStyleProps) =>
      props.selectable &&
      `
      background: rgba(63, 81, 181, 0.7);
      color: white;
      cursor: pointer;
    `};
  }
`;

type AnswerTextProps = StyledProps<{ voted: boolean }>;
const AnswerText = styled.div`
  padding: 10px 15px;
  color: ${(props: AnswerTextProps) =>
    props.voted ? props.theme.accent : 'white'};
  font-weight: ${(props: AnswerTextProps) => (props.voted ? 600 : 400)};
  position: relative;
  z-index: 1;
`;

const AnswerBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: ${props => props.theme.main};
  border-radius: 5px;
  transition: width 0.5s ease;
`;

interface AnswerProps {
  answer: PollAnswer;
  total: number;
  showVote: boolean;
  selectable: boolean;
  voted: boolean;
  multiAnswers: boolean;
  ended: boolean;
  onClick: () => void;
}

const Answer: React.FC<AnswerProps> = props => {
  const answer = props.answer;
  const percent =
    props.total > 0 ? Math.round((answer.votesNb / props.total) * 100) : 0;
  return (
    <AnswerStyle selectable={props.selectable} onClick={props.onClick}>
      <AnswerText voted={props.voted}>
        <Flex>
          <Box mr="5px">{answer.content}</Box>
          <Box ml="auto">{props.showVote && <span>{percent}%</span>}</Box>
        </Flex>
      </AnswerText>
      <AnswerBar
        style={{
          width: (props.showVote ? percent : 0) + '%',
        }}
      />
    </AnswerStyle>
  );
};

interface VotesListProps {
  open: boolean;
  pollid: number;
  handleRequestClose: () => void;
}

interface VotesListState {
  votes: PollVote[];
}

export class VotesList extends React.Component<VotesListProps, VotesListState> {
  state: VotesListState = {
    votes: [],
  };
  componentWillReceiveProps(props: VotesListProps) {
    if (props.open) {
      this.retrieveAllVotes();
    }
  }

  retrieveAllVotes() {
    pollData.getAllVote(this.props.pollid).then(res => {
      this.setState({
        votes: res.data,
      });
    });
  }

  render() {
    const props = this.props;
    return (
      <Dialog open={props.open} onClose={props.handleRequestClose}>
        <DialogTitle>Votes</DialogTitle>
        <DialogContent>
          {this.state.votes.map(v => {
            return (
              <Flex p={2} key={v.id}>
                <Box>
                  <ProfileImage
                    mh="auto"
                    w="40px"
                    alt="Student profile picture"
                    src={v.student.photoUrlThumb}
                  />
                </Box>
                <Box ml="10px">
                  <Title invert fontSize={1.2}>
                    {v.student.firstname} {v.student.lastname}
                  </Title>
                  <Text>A voté pour: "{v.answer.content}"</Text>
                </Box>
              </Flex>
            );
          })}
        </DialogContent>
      </Dialog>
    );
  }
}
