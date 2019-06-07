import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Radio from '@material-ui/core/Radio';
import { Box, Flex } from '@rebass/grid';
import React, { Fragment } from 'react';
import Autocomplete from '../../components/Autocomplete';
import { BgImage, Paper, Title } from '../../components/common';
import Loader from '../../components/Loader';
import { backUrl } from '../../config';
import * as clubData from '../../data/club';
import * as dorData from '../../data/dor';
import {
  AnswerDor,
  AnswerDorScore,
  EventDor,
  QuestionDor,
  VoteDor,
} from '../../data/dor/type';
import * as userData from '../../data/users/student';
import { Author, Club, Employee, Student } from '../../data/users/type';

type PollQuestionDorProps = {
  answer?: VoteDor;
  question: QuestionDor | null;
  onAnswer: () => void;
  results: { [id: number]: AnswerDorScore[] } | null;
};

type PollQuestionDorState = {
  selectedValue: string;
  selected: AnswerDor | null;
  loading: boolean;
};

const IMG_EVENT = '/img/svg/event-dor.svg';

export default class PollQuestionDor extends React.Component<
  PollQuestionDorProps,
  PollQuestionDorState
> {
  state: PollQuestionDorState = {
    selectedValue: '',
    selected: null,
    loading: false,
  };

  renderSugg = (ans: AnswerDor | null) => {
    let name = null,
      url = null;
    if (ans) {
      if (ans.type === 'author') {
        if (ans.value.authorType === 'student') {
          const student = ans.value as Student;
          name = `${student.firstname} ${student.lastname}`;
          url = student.photoUrlThumb
            ? this.buildBackUrl(student.photoUrlThumb)
            : '/img/svg/user.svg';
        } else if (ans.value.authorType === 'club') {
          const club = ans.value as Club;
          name = club.name;
          url = this.buildBackUrl(club.logoUrl);
        } else if (ans.value.authorType === 'employee') {
          const emp = ans.value as Employee;
          name = `${emp.firstname} ${emp.lastname}`;
          url = '/img/svg/user.svg';
        }
      } else if (ans.type === 'event') {
        name = ans.value.name;
        url = IMG_EVENT;
      }
    }
    return (
      <div style={{ display: 'inherit', alignItems: 'inherit' }}>
        <Avatar alt={name || ''} src={url || ''} style={{ marginRight: 10 }} />
        <span>{name}</span>
      </div>
    );
  };

  onSelect = (data: AnswerDor) => {
    const { answer } = this.props;
    if (!answer) {
      this.setState({
        selected: data,
      });
      if (data.type === 'author') {
        if (
          data.value.authorType === 'student' ||
          data.value.authorType === 'employee'
        ) {
          const author = data.value as Student & Employee;
          return `${author.firstname} ${author.lastname}`;
        }
        if (data.value.authorType === 'club') {
          const club = data.value as Club;
          return club.name;
        }
      }
      if (data.type === 'event') {
        const event = data.value as EventDor;
        return event.name;
      }
    }
    return '';
  };

  onSearch = async (search: string): Promise<AnswerDor[]> => {
    this.setState({ selectedValue: search });
    if (!search) {
      this.setState({
        selected: null,
      });
      return [];
    }

    const { question } = this.props;
    const mapAuthor = (authors: Author[]) =>
      authors.map(
        a =>
          ({
            type: 'author',
            value: a,
          } as AnswerDor)
      );
    const all = [] as Promise<AnswerDor[]>[];
    if (question) {
      if (question.enableStudent) {
        const promoFilter = question.enablePromo ? [question.promo] : [];
        const students = userData
          .searchStudents(search, promoFilter, 'a', 0)
          .then(res => mapAuthor(res.data.content));
        all.push(students);
      }
      if (question.enableEmployee) {
        const employees = userData
          .searchEmployees(search)
          .then(res => mapAuthor(res.data));
        all.push(employees);
      }
      if (question.enableClub) {
        const clubs = clubData
          .searchClub(search)
          .then(res => mapAuthor(res.data));
        all.push(clubs);
      }
      if (question.enableEvent || question.enableParty) {
        const events = dorData.searchEvents(search).then(res => {
          return res.data
            .filter(event => {
              if (question.enableEvent) {
                return !event.party;
              }
              if (question.enableParty) {
                return event.party;
              }
              return false;
            })
            .map(
              e =>
                ({
                  type: 'event',
                  value: e,
                } as AnswerDor)
            );
        });
        all.push(events);
      }
    }
    const allRes = await Promise.all(all);
    return allRes.reduce(
      (allSearch, el) => allSearch.concat(el),
      [] as AnswerDor[]
    );
  };

  handleVote = async () => {
    const { question } = this.props;
    const { selected } = this.state;
    if (selected && question) {
      this.setState({ loading: true });
      await dorData.handleVote(question.id, selected);
      await this.props.onAnswer();
      this.setState({ loading: false });
    }
  };

  buildBackUrl(url?: string | null): string | null {
    if (url) {
      return backUrl + url;
    }
    return null;
  }

  getImg(): string | null {
    const { selected } = this.state;
    const { answer } = this.props;

    if (answer) {
      if (answer.resAuthor) {
        const author = answer.resAuthor;
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
      if (answer.resEvent) {
        return IMG_EVENT;
      }
    }

    if (selected) {
      if (selected.type === 'author') {
        if (selected.value.authorType === 'student') {
          return this.buildBackUrl((selected.value as Student).photoUrlThumb);
        }
        if (selected.value.authorType === 'club') {
          return this.buildBackUrl((selected.value as Club).logoUrl);
        }
        if (selected.value.authorType === 'employee') {
          return '/img/svg/user.svg';
        }
      }
      if (selected.type === 'event') {
        return IMG_EVENT;
      }
    }

    return null;
  }

  getLabels() {
    const { question } = this.props;
    const style = {
      marginRight: 5,
    };
    if (question) {
      return (
        <div>
          {question.enableStudent && <Chip style={style} label="Elève" />}
          {question.enableEmployee && <Chip style={style} label="Employé" />}
          {question.enableClub && <Chip style={style} label="Association" />}
          {question.enableEvent && <Chip style={style} label="Evènement" />}
          {question.enableParty && <Chip style={style} label="Soirée" />}
        </div>
      );
    }
    return null;
  }

  getValue(): string {
    const { answer } = this.props;
    console.log(answer);
    if (answer) {
      if (answer.resAuthor) {
        const author = answer.resAuthor;
        if (
          author.authorType === 'student' ||
          author.authorType === 'employee'
        ) {
          const user = author as Student & Employee;
          return `${user.firstname} ${user.lastname}`;
        }
        if (author.authorType === 'club') {
          return (author as Club).name;
        }
      }

      if (answer.resEvent) {
        console.log(answer.resEvent.name);
        return answer.resEvent.name;
      }
    }
    return '';
  }

  isChecked(ans: AnswerDor) {
    const { answer } = this.props;
    const { selected } = this.state;
    if (answer) {
      if (answer.resAuthor) {
        return answer.resAuthor.id === ans.value.id;
      }
      if (answer.resEvent) {
        return answer.resEvent.id === ans.value.id;
      }
      return false;
    }
    if (selected) {
      return selected.value.id === ans.value.id;
    }
    return false;
  }

  renderChoices() {
    const { question, results, answer } = this.props;
    if (results && question) {
      let resultList = results[question.id];
      if (results[question.id]) {
        const resultAnswers = resultList.map(r => {
          if (r.voteDor.resAuthor) {
            return {
              type: 'author',
              value: r.voteDor.resAuthor,
            } as AnswerDor;
          } else if (r.voteDor.resEvent) {
            return {
              type: 'event',
              value: r.voteDor.resEvent,
            } as AnswerDor;
          }
          return null;
        });
        return resultAnswers.map(
          ans =>
            ans && (
              <Box key={ans.value.id}>
                <Flex alignItems="center">
                  {this.renderSugg(ans)}
                  <Radio
                    style={{ marginLeft: 'auto' }}
                    disabled={answer != null}
                    name={`radio-result-${question.id}`}
                    checked={this.isChecked(ans)}
                    onChange={() => this.onSelect(ans)}
                  />
                </Flex>
              </Box>
            )
        );
      }
    }
    return null;
  }

  render() {
    const { question, answer, results } = this.props;
    const { selected, loading } = this.state;

    if (!question) return null;

    return (
      <Paper>
        <BgImage
          mh="200px"
          localImage
          src={this.getImg()}
          defaultSrc="/img/svg/unknown.svg"
        />
        <Box p="20px">
          <Title invert>{question.title}</Title>
          <Box mb="10px">{this.getLabels()}</Box>
          <Loader loading={loading}>
            <Fragment>
              {!results && (
                <Autocomplete<AnswerDor>
                  label="Mon choix"
                  disabled={answer != null}
                  value={this.getValue()}
                  renderSuggestion={this.renderSugg}
                  onSelect={this.onSelect}
                  search={this.onSearch}
                />
              )}
              {results && (
                <Flex flexDirection="column">{this.renderChoices()}</Flex>
              )}
              {!answer && (
                <Button
                  onClick={this.handleVote}
                  style={{ marginTop: 10 }}
                  disabled={selected == null}
                  size="small"
                  color="secondary"
                >
                  Valider
                </Button>
              )}
            </Fragment>
          </Loader>
        </Box>
      </Paper>
    );
  }
}
