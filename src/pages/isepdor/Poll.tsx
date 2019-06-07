import { Box, Flex } from '@rebass/grid';
import React from 'react';
import {
  FluidContent,
  ScrollToTopOnMount,
  Text,
  Title,
} from '../../components/common';
import Loader from '../../components/Loader';
import Time from '../../components/Time';
import * as dorData from '../../data/dor';
import {
  AnswerDorScore,
  QuestionDor,
  SessionDor,
  VoteDor,
} from '../../data/dor/type';
import PollQuestion from './PollQuestion';
import { ResultQuestion } from './ResultQuestion';

type SessionDisplayProps = {
  secondTurn: number;
  result: number;
};
const SessionDisplay: React.FC<SessionDisplayProps> = ({
  secondTurn,
  result,
}) => {
  const now = new Date().getTime();
  if (secondTurn > now) {
    return (
      <div>
        <Title fontSize={1.2} invert>
          1ER TOUR
        </Title>
        <Text>
          <span>Fin du premier tour le </span>
          <Time date={secondTurn} format="Do MMMM YYYY" />
        </Text>
      </div>
    );
  }
  if (result > now) {
    return (
      <div>
        <Title fontSize={1} invert>
          2EME TOUR
        </Title>
        <Text>
          <span>Fin du 2ème tour le </span>
          <Time date={result} format="Do MMMM YYYY" />
        </Text>
      </div>
    );
  }
  if (now > result) {
    return (
      <div>
        <Title fontSize={1} invert>
          RÉSULTATS
        </Title>
      </div>
    );
  }
  return null;
};

type DorPollState = {
  questions: QuestionDor[];
  answers: VoteDor[];
  session: SessionDor | null;
  results: { [id: number]: AnswerDorScore[] } | null;
  isPollEnded: boolean;
  loading: boolean;
};

export default class DorPoll extends React.Component<{}, DorPollState> {
  state: DorPollState = {
    questions: [],
    answers: [],
    session: null,
    results: null,
    isPollEnded: false,
    loading: true,
  };

  async componentDidMount() {
    await Promise.all([this.getQuestions(), this.loadSession()]);
    this.setState({
      loading: false,
    });
  }

  async loadSession() {
    const session = await this.getCurrentSession();
    if (this.isSessionFinished(session)) {
      await this.showResultsSession();
      return;
    }
    const round = this.getCurrentRound(session);
    await this.getCurrentVotes(round);
  }

  getCurrentRound(session: SessionDor): number {
    return session.secondTurn > new Date().getTime() ? 1 : 2;
  }

  async showResultsSession() {
    const res = await dorData.getRoundResults(2);
    this.setState({
      isPollEnded: true,
      results: res.data,
    });
  }

  isSessionFinished(session: SessionDor): boolean {
    return session.result < new Date().getTime();
  }

  async getCurrentSession() {
    const res = await dorData.getCurrentSession();
    this.setState({
      session: res.data,
    });
    return res.data;
  }

  async getQuestions() {
    const res = await dorData.getQuestions();
    this.setState({
      questions: res.data,
    });
  }

  async getCurrentVotes(round: number) {
    const currentVotes = await dorData.getCurrentVotes(round);
    if (round === 2) {
      const roundResults = await dorData.getRoundResults(1);
      this.setState({ results: roundResults.data });
    }
    this.setState({
      answers: currentVotes.data,
    });
  }

  onAnswer = async () => {
    if (this.state.session) {
      await this.getCurrentVotes(this.getCurrentRound(this.state.session));
    }
  };

  renderQuestions = (question: QuestionDor) => {
    const { answers, results, isPollEnded } = this.state;
    const answer = answers.find(ans => ans.questionDor.id === question.id);
    const breakPoints = [1, 1 / 2, 1 / 3];

    if (isPollEnded) {
      return (
        <Box key={question.id} p={3} width={breakPoints}>
          <ResultQuestion question={question} results={results} />
        </Box>
      );
    }
    return (
      <Box key={question.id} p={3} width={breakPoints}>
        <PollQuestion
          question={question}
          answer={answer}
          results={results}
          onAnswer={this.onAnswer}
        />
      </Box>
    );
  };

  render() {
    const { session, questions } = this.state;
    return (
      <FluidContent mh="700px">
        <ScrollToTopOnMount />
        <Title mb="0.2em" fontSize={3}>
          ISEP d'Or
        </Title>
        {session && (
          <Box mb="20px">
            <SessionDisplay
              secondTurn={session.secondTurn}
              result={session.result}
            />
          </Box>
        )}
        <Loader loading={this.state.loading}>
          <Flex flexWrap="wrap">{questions.map(this.renderQuestions)}</Flex>
        </Loader>
      </FluidContent>
    );
  }
}
