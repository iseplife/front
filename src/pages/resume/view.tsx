import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import styled from 'styled-components';
import {
  Banner,
  Filler,
  FluidContent,
  Header,
  Paper,
  ProfileImage,
  Text,
  Title,
} from '../../components/common';
import DatePicker from '../../components/DatePicker';
import FullScreenView from '../../components/FullScreen/View';
import Loader from '../../components/Loader';
import SocialMedia from '../../components/SocialMedia';
import { Student, StudentUpdate } from '../../data/users/type';
import UserInfo from './UserInfo';

const PersonStyle = styled.div`
  > div {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  width: 100%;
  height: 100%;
`;

type ResumeViewProps = {
  user: Student;
  open: boolean;
  isLoading: boolean;
  fullscreenOpen: boolean;
  setFullScreen: (on: boolean) => () => void;
  onModify: () => void;
  changeTab: (event: React.ChangeEvent<{}>, value: any) => void;
  tabIndex: number;
  renderTab: () => React.ReactNode;
  handleRequestClose: () => void;
  handleUpdate: (form: StudentUpdate) => void;
};

export const ResumeView: React.FC<ResumeViewProps> = ({
  user,
  open,
  isLoading,
  setFullScreen,
  onModify,
  tabIndex,
  changeTab,
  renderTab,
  fullscreenOpen,
  handleRequestClose,
  handleUpdate,
}) => {
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
        <Loader loading={isLoading}>
          {user && (
            <Flex flexWrap="wrap">
              <Box p={2} width={[1, 1 / 4]}>
                <PersonStyle
                  onClick={setFullScreen(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <ProfileImage
                    alt=""
                    src={user.photoUrl}
                    w="100%"
                    mh="200px"
                  />
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
                        onClick={onModify}
                      >
                        Modifier
                      </Button>
                    </Box>
                  </Flex>
                  <UserInfo user={user} />
                  <SocialMedia socials={user} />
                </Paper>
              </Box>
              <Box width={1}>
                <Tabs
                  value={tabIndex}
                  onChange={changeTab}
                  indicatorColor="secondary"
                  textColor="primary"
                  centered
                >
                  <Tab label="Compte" />
                  <Tab label="Publications" />
                  <Tab label="Photos" />
                </Tabs>
              </Box>
              {renderTab()}

              <FullScreenView
                visible={fullscreenOpen}
                image={user.photoUrl}
                onEscKey={setFullScreen(false)}
              />
              <UpdateResume
                open={open}
                handleRequestClose={handleRequestClose}
                handleUpdate={handleUpdate}
                data={user}
              />
            </Flex>
          )}
        </Loader>
      </FluidContent>
    </div>
  );
};

type UpdateResumeProps = {
  data: Student;
  open: boolean;
  handleUpdate: (form: StudentUpdate) => void;
  handleRequestClose: () => void;
};
type UpdateResumeState = {
  form: Student;
};

class UpdateResume extends React.Component<UpdateResumeProps> {
  state: UpdateResumeState = {
    form: this.props.data,
  };

  handleChange = (name: string) => ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.handleChangeForm(name, target.value);
  };

  handleChangeForm = (name: string, value: any) => {
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
        TransitionComponent={Slide}
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
          <Button
            onClick={() => props.handleUpdate(data as StudentUpdate)}
            color="secondary"
          >
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
