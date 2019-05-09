// @flow

import React from 'react';

import { Box, Flex } from 'grid-styled';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreHoriz';

import Time from 'components/Time';
import Author from 'components/Author';
import { BgImage, Text, Title, Paper } from '../../components/common';

import Auth from '../../components/Auth/AuthComponent';
import { ADMIN, EVENT_MANAGER } from '../../constants';

export default class Event extends React.Component {
  state = {
    anchorEl: null,
    openMenu: false,
  };

  editEvent = () => {
    this.props.onEdit(this.props.event);
    this.setState({ openMenu: false, anchorEl: null });
  };

  deleteEvent = () => {
    this.props.onDelete(this.props.event);
    this.setState({ openMenu: false, anchorEl: null });
  };

  closeMenu = () => {
    this.setState({ openMenu: false, anchorEl: null });
  };

  handleMenu = e => {
    this.setState({ openMenu: true, anchorEl: e.currentTarget });
  };

  renderDescription(desc: string) {
    const description = desc.length > 300 ? desc.substr(0, 300) + '...' : desc;
    return description.split('\n').map(d => {
      return <Text color="#555">{d}</Text>;
    });
  }

  render() {
    const { event } = this.props;
    return (
      <Paper style={{ marginBottom: 30 }}>
        <Flex flexWrap="wrap">
          <Box w={[1, 1 / 2]}>
            <BgImage src={event.imageUrl} mh="250px" />
          </Box>
          <Box w={[1, 1 / 2]} p="20px">
            <Flex>
              <Link to={`/evenements/${event.id}`}>
                <Box mb={2}>
                  <Title invert fontSize={2} mb="5px">
                    {event.title}
                  </Title>
                  <Text fs="1.1em" mb={0.5}>
                    {event.location}
                  </Text>
                  <Title fontSize={1}>
                    Le{' '}
                    <Time date={event.date} format="DD/MM/YYYY [à] HH[h]mm" />
                  </Title>
                </Box>
              </Link>
              <Box ml="auto">
                <Author data={event.club} />
              </Box>
            </Flex>
            {this.renderDescription(event.description)}
            <Auth roles={[ADMIN, EVENT_MANAGER]}>
              <IconButton color="secondary" onClick={this.handleMenu}>
                <MoreIcon />
              </IconButton>
            </Auth>
            <Menu
              anchorEl={this.state.anchorEl}
              open={this.state.openMenu}
              onClose={this.closeMenu}
            >
              <MenuItem onClick={this.editEvent}>Modifier</MenuItem>
              <MenuItem onClick={this.deleteEvent}>Supprimer</MenuItem>
            </Menu>
          </Box>
        </Flex>
      </Paper>
    );
  }
}
