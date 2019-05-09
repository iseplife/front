// @flow

import React from 'react';

import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom';

import Time from 'components/Time';
import PostListView from 'components/PostList';
import FullScreenView from '../../components/FullScreen/View';
import UserInfo from './UserInfo';

import { Tabs, Tab } from '@material-ui/core';

import {
  Banner,
  Filler,
  FluidContent,
  Header,
  ProfileImage,
  Paper,
  Text,
  Title,
  BgImage,
} from 'components/common';
import Loader from '../../components/Loader';

import { MAIN_COLOR, SECONDARY_COLOR } from '../../colors';

import DatePicker from '../../components/DatePicker';
import SocialMedia from '../../components/SocialMedia';

const PersonStyle = styled.div`
  > div {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  width: 100%;
  height: 100%;
`;

export default function ResumeView(props) {
  const { user, posts, clubMembers } = props;
  return (
    <div>
      <Header url="/img/background.jpg">
        <Filler h={50} />
        <Banner>
          <h1>Profil</h1>
          <p>Ton petit jardin secret</p>
        </Banner>
      </Header>
      <FluidContent>
        <Loader loading={props.isLoading}>
          {user && (
            <Flex flexWrap="wrap">
              <Box p={2} width={[1, 1 / 4]}>
                <PersonStyle
                  onClick={props.setFullScreen(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <ProfileImage src={user.photoUrl} sz="100%" mh="200px" />
                </PersonStyle>
              </Box>
              <Box p={2} width={[1, 3 / 4]}>
                <Paper p="20px">
                  <Flex>
                    <Box>
                      <Title>
                        {user.firstname} {user.lastname}
                      </Title>
                    </Box>
                    <Box ml="auto">
                      <Button
                        variant="raised"
                        color="primary"
                        onClick={props.onModify}
                      >
                        Modifier
                      </Button>
                    </Box>
                  </Flex>
                  <UserInfo user={user} />
                  <SocialMedia socials={user} />
                </Paper>
              </Box>
              <Box w={1}>
                <Tabs
                  value={props.tabIndex}
                  onChange={props.changeTab}
                  indicatorColor="secondary"
                  textColor="primary"
                  centered
                >
                  <Tab label="Compte" />
                  <Tab label="Publications" />
                  <Tab label="Photos" />
                </Tabs>
              </Box>
              {props.renderTab()}

              <FullScreenView
                visible={props.fullscreenOpen}
                image={user.photoUrl}
                onEscKey={props.setFullScreen(false)}
              />
              <UpdateResume
                open={props.open}
                handleRequestClose={props.handleRequestClose}
                handleUpdate={props.handleUpdate}
                data={user}
              />
            </Flex>
          )}
        </Loader>
      </FluidContent>
    </div>
  );
}

class UpdateResume extends React.Component {
  state = {
    form: this.props.data,
  };

  handleChange = (name: string) => ({ target }) => {
    this.handleChangeForm(name, target.value);
  };

  handleChangeForm = (name: string, value) => {
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
  };

  render() {
    const props = this.props;
    let data = this.state.form;
    return (
      <Dialog
        open={props.open}
        transition={Slide}
        onClose={props.handleRequestClose}
      >
        <DialogTitle
          style={{
            textAlign: 'center',
          }}
        >
          Modifier vos informations
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Email"
            value={data.mail}
            fullWidth
            onChange={this.handleChange('mail')}
          />
          <TextField
            margin="normal"
            label="Téléphone"
            value={data.phone}
            fullWidth
            onChange={this.handleChange('phone')}
          />
          <TextField
            margin="normal"
            label="Adresse"
            value={data.address}
            fullWidth
            onChange={this.handleChange('address')}
          />
          <div>
            <Text>Date de naissance</Text>
            <DatePicker
              dateonly
              startYear={new Date().getFullYear() - 30}
              date={data.birthDate}
              onChange={date => this.handleChangeForm('birthDate', date)}
            />
          </div>
          <TextField
            multiline
            rows="4"
            margin="normal"
            label="Bio"
            value={data.bio || ''}
            fullWidth
            onChange={this.handleChange('bio')}
          />
          <TextField
            margin="normal"
            label="Lien Facebook"
            value={data.facebook || ''}
            fullWidth
            onChange={this.handleChange('facebook')}
          />
          <TextField
            margin="normal"
            label="Lien Twitter"
            value={data.twitter || ''}
            fullWidth
            onChange={this.handleChange('twitter')}
          />
          <TextField
            margin="normal"
            label="Lien Instagram"
            value={data.instagram || ''}
            fullWidth
            onChange={this.handleChange('instagram')}
          />
          <TextField
            margin="normal"
            label="Lien Snapchat"
            value={data.snapchat || ''}
            fullWidth
            onChange={this.handleChange('snapchat')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleRequestClose} color="primary">
            Annuler
          </Button>
          <Button onClick={() => props.handleUpdate(data)} color="secondary">
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
