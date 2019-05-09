// @flow
import React, { Fragment } from 'react';

import { Flex, Box } from 'grid-styled';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Radio from '@material-ui/core/Radio';

import {
  Paper,
  Title,
  Text,
  FluidContent,
  BgImage,
} from '../../components/common';

import Autocomplete from '../../components/Autocomplete';
import Loader from '../../components/Loader';

import type {
  QuestionDor,
  EventDor,
  AnswerDor,
  VoteDor,
  AnswerDorScore,
} from '../../data/dor/type';

import * as dorData from '../../data/dor';
import * as clubData from '../../data/club';

import * as userData from '../../data/users/student';
import { backUrl } from '../../config';

type Props = {
  answer: ?VoteDor,
  question: QuestionDor,
  onAnswer: () => mixed,
  results: ?{ [id: number]: AnswerDorScore[] },
};

type State = {
  selectedValue: string,
  selected: ?AnswerDor,
  loading: boolean,
};

const IMG_EVENT = '/img/svg/event-dor.svg';

export default class PollQuestionDor extends React.Component<Props, State> {
  state = {
    selectedValue: '',
    selected: null,
    loading: false,
  };

  renderSugg = (ans: ?AnswerDor) => {
    let name, url;
    if (ans) {
      if (ans.type === 'author') {
        if (ans.value.authorType === 'student') {
          name = `${ans.value.firstname} ${ans.value.lastname}`;
          url = ans.value.photoUrlThumb
            ? this.buildBackUrl(ans.value.photoUrlThumb)
            : '/img/svg/user.svg';
        } else if (ans.value.authorType === 'club') {
          name = ans.value.name;
          url = this.buildBackUrl(ans.value.logoUrl);
        } else if (ans.value.authorType === 'employee') {
          name = `${ans.value.firstname} ${ans.value.lastname}`;
          url = '/img/svg/user.svg';
        }
      } else if (ans.type === 'event') {
        name = ans.value.name;
        url = IMG_EVENT;
      }
    }
    return (
      <div style={{ display: 'inherit', alignItems: 'inherit' }}>
        <Avatar alt={name} src={url} style={{ marginRight: 10 }} />
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
          return `${data.value.firstname} ${data.value.lastname}`;
        }
        if (data.value.authorType === 'club') {
          return data.value.name;
        }
      }
      if (data.type === 'event') {
        return data.value.name;
      }
    }
    return '';
  };

  onSearch = (search: string): Promise<AnswerDor[]> => {
    this.setState({ selectedValue: search });
    if (!search) {
      this.setState({
        selected: null,
      });
      return Promise.resolve([]);
    }

    const { question } = this.props;
    const mapAuthor = authors =>
      authors.map(a => ({
        type: 'author',
        value: a,
      }));
    const all = [];
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
          .map(e => ({
            type: 'event',
            value: e,
          }));
      });
      all.push(events);
    }
    return Promise.all(all).then(res =>
      res.reduce((all, el) => all.concat(el), [])
    );
  };

  handleVote = async () => {
    const { question } = this.props;
    const { selected } = this.state;
    if (selected) {
      this.setState({ loading: true });
      await dorData.handleVote(question.id, selected);
      await this.props.onAnswer();
      this.setState({ loading: false });
    }
  };

  buildBackUrl(url: ?string): ?string {
    if (url) {
      return backUrl + url;
    }
    return null;
  }

  getImg(): ?string {
    const { selected } = this.state;
    const { answer } = this.props;

    if (answer) {
      if (answer.resAuthor) {
        const author = answer.resAuthor;
        if (author.authorType === 'student') {
          return this.buildBackUrl(author.photoUrlThumb);
        }
        if (author.authorType === 'club') {
          return this.buildBackUrl(author.logoUrl);
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
          return this.buildBackUrl(selected.value.photoUrlThumb);
        }
        if (selected.value.authorType === 'club') {
          return this.buildBackUrl(selected.value.logoUrl);
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

  getValue(): ?string {
    const { answer } = this.props;
    if (answer) {
      if (answer.resAuthor) {
        const author = answer.resAuthor;
        if (
          author.authorType === 'student' ||
          author.authorType === 'employee'
        ) {
          return `${author.firstname} ${author.lastname}`;
        }
        if (author.authorType === 'club') {
          return author.name;
        }
      }
    }
    return null;
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
    if (results) {
      let resultList = results[question.id];
      if (results[question.id]) {
        const resultAnswers: AnswerDor[] = resultList.map(r => {
          if (r.voteDor.resAuthor) {
            return {
              type: 'author',
              value: r.voteDor.resAuthor,
            };
          } else if (r.voteDor.resEvent) {
            return {
              type: 'event',
              value: r.voteDor.resEvent,
            };
          }
        });
        return resultAnswers.map(ans => (
          <Box key={ans.value.id}>
            <Flex align="center">
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
        ));
      }
    }
    return null;
  }

  render() {
    const { question, answer, results } = this.props;
    const { selected, loading } = this.state;

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
          <Box mb="10px">{this.getLabels()}</Box>
          <Loader loading={loading}>
            <Fragment>
              {!results && (
                <Autocomplete
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
