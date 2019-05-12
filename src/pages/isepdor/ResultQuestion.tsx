import Avatar from '@material-ui/core/Avatar';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Link } from 'react-router-dom';
import { MAIN_COLOR, SECONDARY_COLOR } from '../../colors';
import { BgImage, Paper, Title } from '../../components/common';
import { backUrl } from '../../config';
import {
  AnswerDor,
  AnswerDorScore,
  EventDor,
  QuestionDor,
} from '../../data/dor/type';
import { Club, Employee, Student } from '../../data/users/type';

const DEFAULT_USER_IMAGE = '/img/svg/user.svg';
const DEFAULT_EVENT_IMAGE = '/img/svg/event-dor.svg';

type RankProps = { pos: number; score: number };
const Rank: React.FC<RankProps> = ({ pos, score }) => {
  const isFirst = pos === 1;
  const style = {
    fontSize: isFirst ? 25 : 15,
    color: isFirst ? SECONDARY_COLOR : MAIN_COLOR,
  };
  return (
    <div
      style={{
        marginLeft: 'auto',
        textAlign: 'right',
      }}
    >
      <div style={style}>
        {pos}
        {isFirst ? 'er' : 'ème'}
      </div>
      <div style={{ color: '#aaa', fontSize: 13 }}>{score}%</div>
    </div>
  );
};

type ResultQuestionProps = {
  question: QuestionDor;
  results: { [id: number]: AnswerDorScore[] } | null;
};

export class ResultQuestion extends React.Component<ResultQuestionProps> {
  renderResultItem = (ans: AnswerDor | null) => {
    let name, url, link;
    if (ans) {
      if (ans.type === 'author') {
        if (ans.value.authorType === 'student') {
          const student = ans.value as Student;
          link = `/annuaire/${student.id}`;
          name = `${student.firstname} ${student.lastname}`;
          url = student.photoUrlThumb
            ? this.buildBackUrl(student.photoUrlThumb)
            : DEFAULT_USER_IMAGE;
        } else if (ans.value.authorType === 'club') {
          const club = ans.value as Club;
          link = `/associations/${club.id}`;
          name = club.name;
          url = this.buildBackUrl(club.logoUrl);
        } else if (ans.value.authorType === 'employee') {
          const emp = ans.value as Employee;
          name = `${emp.firstname} ${emp.lastname}`;
          url = DEFAULT_USER_IMAGE;
        }
      } else if (ans.type === 'event') {
        name = (ans.value as EventDor).name;
        url = DEFAULT_EVENT_IMAGE;
      }
    }
    return (
      <div style={{ display: 'inherit', alignItems: 'inherit' }}>
        <Avatar alt={name || ''} src={url || ''} style={{ marginRight: 10 }} />
        {link && <Link to={link}>{name}</Link>}
        {!link && <span>{name}</span>}
      </div>
    );
  };

  buildBackUrl(url?: string | null): string | null {
    if (url) {
      return backUrl + url;
    }
    return null;
  }

  renderResults() {
    const { question, results } = this.props;
    if (results) {
      let resultList = results[question.id];
      if (results[question.id]) {
        const resultAnswers = resultList.map(r => {
          if (r.voteDor.resAuthor) {
            return {
              type: 'author',
              score: r.score,
              value: r.voteDor.resAuthor,
            } as AnswerDor;
          } else if (r.voteDor.resEvent) {
            return {
              type: 'event',
              score: r.score,
              value: r.voteDor.resEvent,
            } as AnswerDor;
          }
        });

        const totalVotes = resultAnswers.reduce(
          (all, v) => (v && v.score ? all + v.score : 0),
          0
        );
        const computeSharePercent = (total: number, score?: number): number =>
          Math.floor(((score || 0) / total) * 100);

        let remains =
          100 -
          resultAnswers.reduce((all, x) => {
            return x && x.score
              ? all + computeSharePercent(totalVotes, x.score)
              : 0;
          }, 0);

        return resultAnswers.map((ans, index) => {
          if (ans) {
            let score = computeSharePercent(totalVotes, ans.score);
            if (remains > 0) {
              score++;
              remains--;
            }
            return (
              <Box key={ans.value.id} mb={2}>
                <Flex alignItems="center">
                  {this.renderResultItem(ans)}
                  <Rank pos={index + 1} score={score} />
                </Flex>
              </Box>
            );
          }
        });
      }
    }
    return null;
  }

  getImg(): string | null {
    const { question, results } = this.props;

    if (results) {
      const answers = results[question.id];
      if (answers && answers.length > 0) {
        const res = answers[0];
        if (res.voteDor.resAuthor) {
          const author = res.voteDor.resAuthor;
          if (author.authorType === 'student') {
            return this.buildBackUrl((author as Student).photoUrlThumb);
          }
          if (author.authorType === 'club') {
            return this.buildBackUrl((author as Club).logoUrl);
          }
          if (author.authorType === 'employee') {
            return '/img/svg/user.svg';
          }
        }
        if (res.voteDor.resEvent) {
          return DEFAULT_EVENT_IMAGE;
        }
      }
    }

    return null;
  }

  render() {
    const { question, results } = this.props;
    return (
      <Paper>
        <BgImage
          mh="200px"
          local
          src={this.getImg()}
          defaultSrc="/img/svg/unknown.svg"
        />
        <Box p="20px">
          <Title invert>{question.title}</Title>
          <Flex flexDirection="column">{this.renderResults()}</Flex>
        </Box>
      </Paper>
    );
  }
}
