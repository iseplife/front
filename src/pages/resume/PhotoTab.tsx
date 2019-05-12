import Button from '@material-ui/core/Button';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Link } from 'react-router-dom';
import { MAIN_COLOR } from '../../colors';
import { Image, Text } from '../../components/common';
import Loader from '../../components/Loader';
import * as userData from '../../data/users/student';
import * as mediaTypes from '../../data/media/type';

type PhotoTabProps = {
  userId: number;
};
type PhotoTabState = {
  matched: mediaTypes.MatchedView[];
  page: number;
  lastPage: boolean;
  loading: boolean;
};

export class PhotoTab extends React.Component<PhotoTabProps, PhotoTabState> {
  state: PhotoTabState = {
    matched: [],
    page: 0,
    lastPage: false,
    loading: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.requestPhotos(0);
  }

  async requestPhotos(page: number) {
    const res = await userData.getTaggedPhotos(
      this.props.userId,
      this.state.page
    );
    this.setState({
      matched: this.state.matched.concat(res.data.content),
      page: this.state.page + 1,
      lastPage: res.data.last,
      loading: false,
    });
  }

  onSeeMore = () => {
    this.requestPhotos(this.state.page);
  };

  render() {
    const { matched, lastPage } = this.state;
    return (
      <Box p={2} width={1}>
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
                  <Box
                    key={match.id}
                    width={[1 / 2, 1 / 3, 1 / 5]}
                    p={1}
                    mb={2}
                  >
                    <Flex alignItems="center" style={{ height: '100%' }}>
                      <Link
                        to={{
                          pathname: '/gallery/' + match.galleryId,
                          state: { imageId: match.image.id },
                        }}
                        style={{ width: '100%' }}
                      >
                        <Image w="100%" alt="" src={match.image.thumbUrl} />
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
