// Libraries from React
import React, { Component } from 'react'
import {  StyleSheet,
          View,
          ActivityIndicator } from 'react-native'

// Local Libraries
import UserList from './src/components/UserList'
import UserSectionList from './src/components/UserSectionList'
import _ from 'lodash'


// Facultatif:
const sampleData = [
  {
    name: { title: 'mr', first: 'karl', last: 'johnson' },
    email: 'karl.johnson@example.com',
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/62.jpg',
    },
  },
  {
    name: { title: 'mrs', first: 'asuncion', last: 'gomez' },
    email: 'asuncion.gomez@example.com',
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/women/52.jpg',
    },
    nat: 'ES',
  },
  {
    name: { title: 'miss', first: 'gilcenira', last: 'ribeiro' },
    email: 'gilcenira.ribeiro@example.com',
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/women/21.jpg',
    },
  },
]

export default class App extends Component {
  state = {
  page: 1,
  results: 20,
  totalPage: 3,
  seed: 'demo',
  isFetching: false,
  data: [],
  hasMoreResult: true,
  refreshing: false,
  formatedData: [],
}
  async fetchData(page) {
  const uri = "https://randomuser.me/api/";
  const response = await fetch(`${uri}?page=${page}&results=${this.state.results}&seeds=${this.state.seed}`);
  const jsondata = await response.json();
  return jsondata.results;
}

async loadData(page) {
    this.setState({ isFetching: true });
    const data = await this.fetchData(page);
    const nextPage = page + 1;
    const formatedData = this.fromArrayToSectionData(data);
    this.setState({
      page: nextPage,
      data: [...this.state.data, ...data],
      isFetching: false,
      hasMoreResult: nextPage <= this.state.totalPage,
      formatedData: formatedData
    });
  }

  async refreshData() {
    this.setState({ refreshing: true });
    const data = await this.fetchData(1);
    const formatedData = this.fromArrayToSectionData(data);
    this.setState({
      page: 2,
      data: data,
      refreshing: false,
      hasMoreResult: true,
      formatedData: formatedData
    });
  }

async componentDidMount() {
   await this.loadData(this.state.page);
}

fromArrayToSectionData(data) {
    let ds = _.groupBy(data, d => d.name.last.charAt(0));
    ds = _.reduce(
      ds,
      (acc, next, index) => {
        acc.push({
          key: index,
          data: next
        });
        return acc;
      },
      []
    );
    ds = _.orderBy(ds, ["key"]);
    return ds;
 }
 render(){
   return(
     <View style={styles.container}>
       <UserSectionList
         data={this.state.formatedData}
         isFetching={this.state.isFetching}
         loadMore={() => this.loadData(this.state.page)}
         hasMoreResult={this.state.hasMoreResult}
         refreshing={this.state.refreshing}
         refresh={() => this.refreshData()}
       />
     </View>
   );
 }
}

const styles = StyleSheet.create({ container: { flex: 1, paddingTop: 20 } })
