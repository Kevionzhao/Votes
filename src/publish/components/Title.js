import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Modal, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

const { width } = Dimensions.get('window');
const defaultWidth = width - 90 * 2

export default class Title extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        visible: false,
        title: '', 
        key: 0,
    }
  }
  
  _onSelect = (tab) => {     
    this.props.setType(tab);
    this.setState({ visible: false,key: tab });
  }

    // 获得子组件的值  
  setItemValue(title) {
       this.props.setTitle(title);
       this.setState({title:title});       
  }  

  render() {
    const { tab, title } = this.props
    const { key } = this.state
    const tabs = [{ key: '0', value: '单选' }, { key: '1', value: '多选' }]
    const tabDefault = { '0': '单选', '1': '多选' }

    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <TextInput style={styles.input}
            value={title}
            placeholder='输入标题'
            underlineColorAndroid="transparent"
            onChangeText={(title) => { this.setItemValue(title) }}
          />
          <TouchableOpacity onPress={() => { this.setState({ visible: true }) }}>
            <View style={styles.tabView}>
              <Text>{tabDefault[key]}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => null}     //修复安卓modal的告警
        >
          <TouchableWithoutFeedback onPress={() => { this.setState({ visible: false }) }}>
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                {
                  tabs.map((tab, index) => (
                    <TouchableOpacity key={index} onPress={() => { this._onSelect(tab.key) }}>
                      <View style={styles.rowView}>
                        <Text style={styles.rowText}>{tab.value}</Text>
                      </View>
                      {index != tabs.length - 1 ? <View style={styles.rowLine}></View> : null}
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  titleView: {
    height: 44,
    borderRadius: 5,
    borderWidth: 1,
    margin: 15,
    marginBottom: 0,
    flexDirection: 'row',
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },

  input: {
    flex: 8,
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 15,
  },

  tabView: {
    flex: 2,
    margin: 3,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  modal: {
    width: defaultWidth,
    borderRadius: 5,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },

  rowView: {
    padding: 16,
  },

  rowLine: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },

  rowText: {
    textAlign: 'center',
  }
});
