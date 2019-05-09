// @flow

import React, { Component, PureComponent } from 'react';
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import { Link } from 'react-router-dom';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import { Input, InputLabel } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import {
  Banner,
  Filler,
  FluidContent,
  Header,
  ProfileImage,
  SearchBar,
  Text,
} from 'components/common';
import { MAIN_COLOR } from '../../colors';
import Loader from 'components/Loader';

import * as authData from '../../data/auth';
import { getPromo, computeYearsPromo } from '../../data/users/student';

const BadgeYear = styled.div`
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 5px 8px;
  line-height: initial;
  border-radius: 20px;
  margin-left: 5px;
  background: ${p => p.theme.main};
  color: white;
`;

const MainText = styled.div`
  padding: 10px;
  color: ${p => p.theme.accent};
  font-weight: bold;
  p {
    margin: 0;
    vertical-align: middle;
  }
  p.name {
    margin-bottom: 5px;
    font-size: 1.1em;
    color: ${p => p.theme.main};
  }
`;

const Person = props => {
  const promo = getPromo(props.promotion);
  return (
    <div style={{ boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', height: '100%' }}>
      <ProfileImage src={props.url} h="150px" mh="200px" />
      <MainText>
        <p className="name">{props.name}</p>
        <div>
          Promo {props.promotion} {promo && <BadgeYear>{promo}</BadgeYear>}
        </div>
      </MainText>
    </div>
  );
};

const STYLE_FORMCONTROL = {
  width: '100%',
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const years = computeYearsPromo();

export default class AddressBook extends PureComponent {
  render() {
    return (
      <div>
        <Header url="/img/background.jpg">
          <Filler h={50} />
          <Banner>
            <h1>Annuaire</h1>
            <p>Si vous voulez stalker, c'est ici que ça se passe !</p>
          </Banner>
          <FluidContent p="0">
            <Flex align="center">
              <Box flex="1 1 auto">
                <SearchBar
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder="Rechercher des ami(e)s"
                  onChange={this.props.onSearch}
                />
              </Box>
            </Flex>
          </FluidContent>
        </Header>
        <FluidContent>
          <Flex align="center" flexWrap="wrap">
            <Box>
              {this.props.isSearching && (
                <Text>{this.props.total} étudiants trouvé</Text>
              )}
            </Box>
            <Box flex="0 0 auto" ml="auto" w={['100%', 120]}>
              <FormControl style={STYLE_FORMCONTROL}>
                <InputLabel htmlFor="year-multiple">Promotions</InputLabel>
                <Select
                  multiple
                  value={this.props.year}
                  renderValue={years =>
                    years.map(year => (
                      <BadgeYear>{getPromo(year) || year}</BadgeYear>
                    ))
                  }
                  onChange={this.props.onPromoFilter}
                  input={<Input id="year-multiple" />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                        width: 200,
                      },
                    },
                  }}
                >
                  {years.map(year => {
                    const promo = getPromo(year);
                    return (
                      <MenuItem
                        key={year}
                        value={year}
                        style={{
                          background: 'none',
                          fontWeight:
                            this.props.year.indexOf(year) !== -1
                              ? 500
                              : 'normal',
                          color:
                            this.props.year.indexOf(year) !== -1
                              ? MAIN_COLOR
                              : 'black',
                          alignItems: 'center',
                        }}
                      >
                        <span>
                          {year} {promo && <BadgeYear>{promo}</BadgeYear>}
                        </span>
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>Sélection multiple</FormHelperText>
              </FormControl>
            </Box>
            <Box flex="0 0 auto" ml={[0, 10]} w={['100%', 120]}>
              <FormControl style={STYLE_FORMCONTROL}>
                <InputLabel htmlFor="alpha-simple">Nom</InputLabel>
                <Select
                  value={this.props.alpha}
                  onChange={this.props.onSort}
                  input={<Input id="alpha-simple" />}
                >
                  <MenuItem value="a">Az</MenuItem>
                  <MenuItem value="z">Za</MenuItem>
                </Select>
                <FormHelperText>Sélection simple</FormHelperText>
              </FormControl>
            </Box>
          </Flex>
          <Loader loading={this.props.page === 0 && this.props.loading}>
            <Flex flexWrap="wrap">
              {this.props.students.map(e => {
                return (
                  <Box key={e.id} w={[1, 1 / 3, 1 / 5]} p={2}>
                    {authData.isLoggedIn() ? (
                      <Link to={`/annuaire/${e.id}`}>
                        <Person
                          url={e.photoUrlThumb}
                          name={e.firstname + ' ' + e.lastname}
                          promotion={e.promo}
                        />
                      </Link>
                    ) : (
                      <Person
                        url={e.photoUrlThumb}
                        name={e.firstname + ' ' + e.lastname}
                        promotion={e.promo}
                      />
                    )}
                  </Box>
                );
              })}
            </Flex>
            {!this.props.lastPage && (
              <div style={{ textAlign: 'center' }}>
                <Button
                  variant="fab"
                  color="primary"
                  disabled={this.props.loading}
                  onClick={this.props.onSeeMore}
                >
                  <ArrowDownwardIcon />
                </Button>
              </div>
            )}
          </Loader>
        </FluidContent>
      </div>
    );
  }
}
