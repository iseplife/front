import React, { Component, KeyboardEvent } from 'react';
import styled from 'styled-components';

const Input = styled.textarea`
  border: 2px solid #999999;
  border-radius: 5px;
  padding: 10px;
  font-size: 1.2em;
  outline: none;
  color: #555;
  font-family: 'Roboto';
  width: 100%;
  resize: none;

  &:focus {
    border-color: ${props => props.theme.main};
  }
`;

interface CommentBoxProps {
  onComment: (message: string) => void;
}

interface CommentBoxState {
  message: string;
  rows: number;
  shift: boolean;
}

class CommentBox extends Component<CommentBoxProps, CommentBoxState> {
  state = {
    message: '',
    rows: 2,
    shift: false,
  };

  keyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !this.state.shift) {
      event.preventDefault();
    }
    if (event.key === 'Shift') {
      this.setState({ shift: true });
    }
  };

  keyUp = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      this.setState({ shift: false });
    }

    if (event.key === 'Enter') {
      if (!this.state.shift && this.state.message !== '') {
        this.props.onComment(this.state.message);
        this.setState({ message: '' });
      }
    }
  };

  change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const numRows = event.currentTarget.value.split('\n').length;
    this.setState({
      message: event.currentTarget.value,
      rows: Math.min(numRows + 1, 5),
    });
  };

  render() {
    return (
      <div>
        <Input
          rows={this.state.rows}
          placeholder="Appuyez sur Entrée pour envoyer..."
          value={this.state.message}
          onKeyUp={this.keyUp}
          onKeyDown={this.keyDown}
          onChange={this.change}
        />
      </div>
    );
  }
}

export default CommentBox;
