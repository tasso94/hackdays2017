import Swipeable from 'react-native-swipeable';
import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';

import TaskItem from './TaskItem';
import ModalDialog from './ModalDialog';

export default class TaskList extends React.Component {

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({item}) => {
    const completeBtn = (
      <View style={[styles.leftContent, {backgroundColor: '#ff3b30'}]}>
        <Text style={styles.whiteText}>Complete</Text>
      </View>
    );
    const claimBtn =  (
      <View style={[styles.rightContent, {backgroundColor: '#007aff', paddingLeft: 30}]}>
        <Text style={styles.whiteText}>Claim</Text>
      </View>
    );
    const dueDateBtn =  (
      <View style={[styles.rightContent, {backgroundColor: '#D3D3D3'}]}>
        <Text style={styles.whiteText}>Due Date</Text>
      </View>
    );
    const rightButtons = [
      claimBtn,
      dueDateBtn
    ];

    return (
    <Swipeable style={styles.item} leftContent={completeBtn} rightButtons={rightButtons} rightButtonWidth={100}>
      <TaskItem openModal={this.setModalVisible} {...item} />
    </Swipeable>
  );
};

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      data: []
    };

    this.setModalVisible = this.setModalVisible.bind(this);
  }

  _fetchData() {
    return fetch('http://localhost:8080/engine-rest/task?sortBy=created&sortOrder=desc')
      .then(response => response.json())
      .then((data) => {
        const mappedData = data.map(dataItem => Object.assign({}, dataItem, { key: dataItem.id }));
        this.setState({ data: mappedData });
      });
  }

  componentDidMount() {
    this._fetchData();
  }

  setModalVisible(visible) {
    this.refs.modal.setModalVisible(visible);
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    this._fetchData().then(() => {
      this.setState({isRefreshing: false});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ModalDialog ref="modal"/>
        <FlatList
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          data={this.state.data}
          refreshControl={
             <RefreshControl
                 refreshing={this.state.isRefreshing}
                 onRefresh={this._onRefresh.bind(this)}
                 title="Pull to refresh"
              />
           }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flex: 1,
    padding: 15,
    paddingLeft: 0,
    paddingRight: 0
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'red',
    padding: 20
  },
  rightContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20
  },
  whiteText: {
    color: 'white'
  }
});
