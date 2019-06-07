import { MenuItem } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React from 'react';

const resStyle: React.CSSProperties = {
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

interface AutocompleteProps<T> {
  label: string;
  fullWidth: boolean;
  disabled: boolean;
  value?: string;
  renderSuggestion: (value: T) => React.ReactNode;
  onSelect: (value: T) => string | void;
  search: (data: string) => Promise<any[]>;
}

interface AutocompleteState<T> {
  results: T[];
  value: string;
  focus: boolean;
}

export default class Autocomplete<T> extends React.Component<
  AutocompleteProps<T>,
  AutocompleteState<T>
> {
  state: AutocompleteState<T> = {
    results: [],
    value: '',
    focus: false,
  };

  componentDidUpdate(prevProps: AutocompleteProps<T>) {
    if (this.props.value !== this.state.value) {
      if (this.props.value || this.props.value === '') {
        this.setState({ value: this.props.value });
      }
    }
  }

  renderResults = (val: T, index: number) => {
    return (
      <MenuItem key={index} onMouseDown={this.handleSelect(val)}>
        {this.props.renderSuggestion(val)}
      </MenuItem>
    );
  };

  handleSelect = (sel: T) => () => {
    console.log(sel);
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

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    this.setState({ value: val });
    this.handleSuggestionsFetchRequested(val);
  };

  render() {
    const { label, fullWidth, disabled } = this.props;
    const { results, value, focus } = this.state;

    const showResults =
      value && focus && value.length > 0 && results.length > 0;

    const autocompleteStyle: React.CSSProperties = {
      position: 'relative',
      width: fullWidth ? '100%' : 300,
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

  static defaultProps: AutocompleteProps<string> = {
    fullWidth: true,
    disabled: false,
    renderSuggestion: () => null,
    onSelect: () => {},
    search: () => Promise.resolve([]),
    label: '',
  };
}
