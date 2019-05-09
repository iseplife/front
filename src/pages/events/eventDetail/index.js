// @flow

import React, { Component } from 'react';

import {
  FluidContent,
  ScrollToTopOnMount,
  BgImage,
  Title,
  Text
} from 'components/common';
import Loader from 'components/Loader';
import Time from 'components/Time';
import Author from 'components/Author';

import { Flex, Box } from 'grid-styled';

import * as eventData from 'data/event';
import * as utils from '../../../data/util';

class EventDetail extends Component {
  state = {
    event: null,
    isLoading: false,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    eventData.getEvent(this.props.match.params.id).then(res => {
      this.setState({ event: res.data, isLoading: false });
    });
  }

  render() {
    const { event } = this.state;
    return (
      <div>
        <ScrollToTopOnMount />
        <Loader loading={this.state.isLoading}>
          {
            event &&
            <div>
              <BgImage src={event.imageUrl} mh="200px" />
              <FluidContent>
                <Flex>
                  <Box mb={2}>
                    <Title invert>{event.title}</Title>
                    <div>
                      <Title fontSize={1}>Le <Time date={event.date} format="DD/MM/YYYY [à] HH[h]mm" /></Title>
                      <Text fs="1.1em" mb={.5}>{event.location}</Text>
                    </div>
                  </Box>
                  <Box ml="auto">
                    <Author data={event.club} />
                  </Box>
                </Flex>
                <Box mt="10px" style={{ minHeight: 300 }}>
                  {
                    event.description
                      .split('\n')
                      .map((par, i) => <Text
                        key={i}
                        color="#555"
                        mb={1}>{utils.parseText(par)}</Text>)
                  }
                </Box>
              </FluidContent>
            </div>
          }
        </Loader>
      </div>
    );
  }
}

export default EventDetail;
