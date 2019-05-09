// @flow

import React, { Component } from 'react';

import AddressBookView from './view';

import * as studentData from 'data/users/student';

class AddressBook extends Component {
  state = {
    students: [],
    isSearching: false,
    search: '',
    promotionFilter: [],
    sort: 'a',
    page: 0,
    lastPage: false,
    isLoading: true,
    total: 0,
  };

  componentDidMount() {
    this.getStudents();
  }

  getStudents = async () => {
    this.setState({ isLoading: true });
    const { search, promotionFilter, sort, page } = this.state;
    let res = await studentData.searchStudents(
      search,
      promotionFilter,
      sort,
      page
    );
    this.setState({
      isLoading: false,
      students: this.state.students.concat(res.data.content),
      page: this.state.page + 1,
      lastPage: res.data.last,
      total: res.data.totalElements,
    });
  };

  onSeeMore = () => {
    this.getStudents();
  };

  searchStudents = ({ target }) => {
    const search = target.value;
    const { promotionFilter, sort } = this.state;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(async () => {
      const res = await studentData.searchStudents(
        search,
        promotionFilter,
        sort,
        0
      );
      this.setState({
        search,
        students: res.data.content,
        isSearching: search !== '',
        page: 1,
        lastPage: res.data.last,
        total: res.data.totalElements,
      });
    }, 300);
  };

  handleSort = async event => {
    const sort = event.target.value;
    const { search, promotionFilter } = this.state;
    const res = await studentData.searchStudents(
      search,
      promotionFilter,
      sort,
      0
    );
    this.setState({
      sort,
      page: 1,
      students: res.data.content,
      lastPage: res.data.last,
      total: res.data.totalElements,
    });
  };

  handlePromoFilter = async event => {
    const promotionFilter = event.target.value;
    const { search, sort } = this.state;
    const res = await studentData.searchStudents(
      search,
      promotionFilter,
      sort,
      0
    );
    this.setState({
      promotionFilter,
      students: res.data.content,
      isSearching: promotionFilter.length > 0,
      page: 1,
      lastPage: res.data.last,
      total: res.data.totalElements,
    });
  };

  render() {
    return (
      <AddressBookView
        alpha={this.state.sort}
        page={this.state.page}
        year={this.state.promotionFilter}
        loading={this.state.isLoading}
        lastPage={this.state.lastPage}
        students={this.state.students}
        onSearch={this.searchStudents}
        onSort={this.handleSort}
        onPromoFilter={this.handlePromoFilter}
        isSearching={this.state.isSearching}
        onSeeMore={this.onSeeMore}
        total={this.state.total}
      />
    );
  }
}

export default AddressBook;
