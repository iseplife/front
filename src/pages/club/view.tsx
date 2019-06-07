import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Box, Flex } from '@rebass/grid';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Auth from '../../components/Auth/AuthComponent';
import {
  Banner,
  BgImage,
  Filler,
  FluidContent,
  Header,
  SearchBar,
  Text,
} from '../../components/common';
import Loader from '../../components/Loader';
import * as roles from '../../constants';
import * as userTypes from '../../data/users/type';
import AddClubForm from './AddClubForm';

const ClubStyle = styled.div`
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 100%;

  > p {
    padding: 10px;
    margin: 0;
    text-align: center;
    font-size: 1.2em;
    font-weight: 500;
    color: ${props => props.theme.main};
  }
`;
type ClubTitleProps = {
  url: string;
  name: string;
};
const ClubTitle: React.FC<ClubTitleProps> = props => {
  return (
    <ClubStyle>
      <BgImage src={props.url} mh="200px" />
      <p>{props.name}</p>
    </ClubStyle>
  );
};

type State = {
  open: boolean;
  search: string;
};

type Props = {
  clubs: userTypes.Club[];
  loading: boolean;
  addClub: (s: any) => Promise<any>;
};

export default class Club extends Component<Props, State> {
  static defaultProps = {
    clubs: [],
    loading: false,
  };

  state = {
    open: false,
    search: '',
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleSearch = (event: any) => {
    this.setState({ search: event.target.value });
  };

  getClubs() {
    const { search } = this.state;
    return this.props.clubs.filter(
      c => c.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  }

  render() {
    const { loading } = this.props;
    return (
      <div>
        <Header url="/img/background.jpg">
          <Filler h={50} />
          <Banner>
            <h1>Associations</h1>
            <p>Participez à la vie étudiante de l'ISEP</p>
          </Banner>
          <FluidContent p="0">
            <SearchBar
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Rechercher des associations"
              onChange={this.handleSearch}
            />
          </FluidContent>
        </Header>
        <FluidContent>
          <Auth roles={[roles.ADMIN, roles.CLUB_MANAGER]}>
            <Flex>
              <Box ml="auto">
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={() => this.setState({ open: true })}
                >
                  <AddIcon />
                </Fab>
              </Box>
              <AddClubForm
                title="Ajouter une association"
                open={this.state.open}
                handleRequestClose={this.handleRequestClose}
                onSave={this.props.addClub}
              />
            </Flex>
          </Auth>
          <Loader loading={loading}>
            {this.props.clubs.length === 0 && (
              <div
                style={{ textAlign: 'center', minHeight: 300, marginTop: 100 }}
              >
                <Text fs="2em">Aucune association</Text>
              </div>
            )}
            <Flex flexWrap="wrap" style={{ minHeight: 300 }}>
              {this.getClubs().map(e => {
                return (
                  <Box key={e.id} width={[1, 1 / 3, 1 / 4]} p={2}>
                    <Link to={`/associations/${e.id}`}>
                      <ClubTitle url={e.logoUrl} name={e.name} />
                    </Link>
                  </Box>
                );
              })}
            </Flex>
          </Loader>
        </FluidContent>
      </div>
    );
  }
}
