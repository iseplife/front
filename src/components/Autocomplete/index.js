// @flow

import React from 'react';

import type { Node } from 'react';

import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';

import type { AxiosPromise } from 'axios';

import type { Student } from '../../data/users/type';

type Props = {
  label: string,
  fullWidth?: boolean,
  disabled?: boolean,
  value?: ?string,
  renderSuggestion: (value: any) => Node,
  onSelect: (value: any) => string,
  search: (data: string) => Promise<any[]>,
};

type State = {
  results: any[],
  value: string,
  focus: boolean,
};

export default class Autocomplete extends React.Component<Props, State> {
  state: State = {
    results: [],
    value: '',
    focus: false,
  };

  static defaultProps = {
    fullWidth: true,
    label: '',
  };

  componentWillReceiveProps(props: Props) {
    if (props.value || props.value === '') {
      this.setState({ value: props.value });
    }
  }

  renderResults = (val: any, index: number) => {
    return (
      <MenuItem key={index} onMouseDown={this.handleSelect(val)}>
        {this.props.renderSuggestion(val)}
      </MenuItem>
    );
  };

  handleSelect = (sel: any) => () => {
    // const fullName = val.firstname + ' ' + val.lastname;
    const value = this.props.onSelect(sel);
    if (value) {
      this.setState({ value });
    }
  };

  handleSuggestionsFetchRequested = (value: string) => {
    this.props.search(value).then(list => {
      this.setState({ results: list });
    });
  };

  handleChange = (event: any) => {
    const val = event.target.value;
    this.setState({ value: val });
    this.handleSuggestionsFetchRequested(val);
  };

  render() {
    const { label, fullWidth, disabled } = this.props;
    const { results, value, focus } = this.state;
    const showResults =
      value && focus && value.length > 0 && results.length > 0;
    const autocompleteStyle = {
      position: 'relative',
      width: fullWidth ? '100%' : 300,
    };
    const resStyle = {
      position: 'absolute',
      top: 5,
      padding: '10px 0',
      width: '100%',
      background: 'white',
      zIndex: 2,
      overflow: 'auto',
      maxHeight: 200,
      boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
    };
    return (
      <div>
        <TextField
          fullWidth
          type="text"
          disabled={disabled}
          autoComplete="off"
          label={label}
          value={value}
          InputLabelProps={{
            style: {
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width: '100%',
            },
          }}
          onFocus={() => this.setState({ focus: true })}
          onBlur={e => this.setState({ focus: false })}
          onChange={this.handleChange}
        />
        {showResults && (
          <div style={autocompleteStyle}>
            <div style={resStyle}>{results.map(this.renderResults)}</div>
          </div>
        )}
      </div>
    );
  }
}
