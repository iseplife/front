// @flow

import React from 'react';

import { Box, Flex } from 'grid-styled';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import Loader from '../../components/Loader';

import { Text, Title, Image } from 'components/common';

import { MAIN_COLOR } from '../../colors';

import * as userData from '../../data/users/student';
import * as authData from '../../data/auth';

export default class PhotoTab extends React.Component {
  state = {
    matched: [],
    page: 0,
    lastPage: false,
    loading: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.requestPhotos(0);
  }

  requestPhotos(page: number) {
    return userData
      .getTaggedPhotos(this.props.userId, this.state.page)
      .then(res => {
        this.setState({
          matched: this.state.matched.concat(res.data.content),
          page: this.state.page + 1,
          lastPage: res.data.last,
          loading: false,
        });
      });
  }

  onSeeMore = () => {
    this.requestPhotos(this.state.page);
  };

  render() {
    const { matched, lastPage } = this.state;
    return (
      <Box p={2} w={1}>
        <Loader loading={this.state.loading}>
          {matched.length === 0 && (
            <div
              style={{ textAlign: 'center', minHeight: 200, marginTop: 100 }}
            >
              <Text fs="2em">Aucune photo</Text>
            </div>
          )}
          {matched.length !== 0 && (
            <Flex flexWrap="wrap" style={{ marginTop: 30, minHeight: 300 }}>
              {matched.map((match, index) => {
                return (
                  <Box key={match.id} w={[1 / 2, 1 / 3, 1 / 5]} p={1} mb={2}>
                    <Flex align="center" style={{ height: '100%' }}>
                      <Link
                        to={{
                          pathname: '/gallery/' + match.galleryId,
                          state: { imageId: match.image.id },
                        }}
                        style={{ width: '100%' }}
                      >
                        <Image w="100%" src={match.image.thumbUrl} />
                      </Link>
                    </Flex>
                    <Text>
                      Ajoutée par{' '}
                      <span style={{ color: MAIN_COLOR }}>
                        <Link to={`/annuaire/${match.owner.id}`}>
                          {this.props.userId === match.owner.id
                            ? 'Moi'
                            : `${match.owner.firstname} ${
                                match.owner.lastname
                              }`}
                        </Link>
                      </span>
                    </Text>
                  </Box>
                );
              })}
            </Flex>
          )}
          {!lastPage && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Button onClick={this.onSeeMore} color="secondary">
                Voir plus
              </Button>
            </div>
          )}
        </Loader>
      </Box>
    );
  }
}
