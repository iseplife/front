import React, { Component } from 'react';
import styled, { StyledProps } from 'styled-components';
import * as userData from '../../data/users/student';
import { CancelablePromise, makeCancelable } from '../../data/util';
import { ProfileImage } from '../common';

type ProfileProps = StyledProps<{
  loading?: boolean;
}>;
const Profile = styled.div`
  display: flex;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 0;
  margin-left: 5px;
  max-width: 150px;
  transition: opacity 0.3s ease;
  opacity: ${(props: ProfileProps) => (props.loading ? 0 : 1)};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    cursor: pointer;
  }

  > .infos {
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  > .infos > span {
    display: block;
    font-weight: 500;
    padding: 2px;
  }

  @media (max-width: 40em) {
    margin-left: auto;
  }
`;

type ProfileMenuProps = {
  onClick: (event: React.MouseEvent) => void;
};

class ProfileMenu extends Component<ProfileMenuProps> {
  state = {
    photoUrlThumb: '',
    firstname: '',
    lastname: '',
    loading: true,
  };

  getLoggedUserReq?: CancelablePromise;

  componentDidMount() {
    this.getLoggedUserReq = makeCancelable(userData.getLoggedUser());
    this.getLoggedUserReq.promise
      .then(res => {
        const { photoUrlThumb, firstname, lastname } = res.data;
        this.setState({ photoUrlThumb, firstname, lastname, loading: false });
      })
      .catch(err => {});
  }

  componentWillUnmount() {
    if (this.getLoggedUserReq) {
      this.getLoggedUserReq.cancel();
    }
  }

  render() {
    const { photoUrlThumb, firstname, lastname, loading } = this.state;
    if (loading) return null;
    return (
      <Profile onClick={this.props.onClick} loading={loading}>
        <ProfileImage src={photoUrlThumb} alt="User profile photo" w="40px" />
        <div className="infos">
          <span>{firstname}</span>
          <span>{lastname}</span>
        </div>
      </Profile>
    );
  }
}

export default ProfileMenu;
