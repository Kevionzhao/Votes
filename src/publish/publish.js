import React, { PureComponent } from 'react'
import { StyleSheet, Alert, View, ScrollView, Text, TextInput, Image, Modal, StatusBar, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import Setting from '../config/setting';
import BaseServiceApiNet from '../utils/baseServiceApiNet';
import AddList from './components/AddList';
import Title from './components/Title'
import LoadingView from '../utils/loadingView';

export default class Publish extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      paramsData: {},
      paramsControl: {
        title: {
          title: "",
          validate: false
        },
        type: {
          type: 0,
          validate: true
        },
        items: [{
          value: "",
          validate: false
        }],
        setTitle: function (title) {
          this.title.title = title;
          if (title) {
            this.title.validate = true;
          } else {
            this.title.validate = false;
          }
        },
        setType: function (type) {
          this.type.type = type;
          if (type) {
            this.type.validate = true;
          } else {
            this.type.validate = false;
          }
        },
        setItems: function (items) {
          this.items = items.filter(function (e, index) {
            if (e.value) {
              e.validate = true;
              return true;
            } else {
              e.validate = false;
              return true;
            }
          })
        },
        isValidate: function () {
          var isValidate = { validate: false, message: "" };
          if (!this.title.validate) {
            isValidate.message = "请输入标题";
            return isValidate;
          }
          if (!this.items.length) {
            isValidate.message = "请输入你要投票内容!";
            return isValidate;
          }
          for (var i in this.items) {
            if (!this.items[i].validate) {
              isValidate.message = "请输入你的投票信息！";
              return isValidate;
            }
          }
          isValidate.validate = true;
          return isValidate;
        },
        submitData: function () {
          var data = {};
          data.title = this.title.title;
          data.type = this.type.type;
          data.items = this.items.map(function (e, index) {
            return e.value;
          })
          return data;
        }
      },
      showLoading:false,
    }
    this.state.paramsControl.setTitle = this.state.paramsControl.setTitle.bind(this.state.paramsControl);
    this.state.paramsControl.setItems = this.state.paramsControl.setItems.bind(this.state.paramsControl);
    this.state.paramsControl.setType = this.state.paramsControl.setType.bind(this.state.paramsControl);
    this.state.paramsControl.isValidate = this.state.paramsControl.isValidate.bind(this.state.paramsControl);
    this.state.paramsControl.submitData = this.state.paramsControl.submitData.bind(this.state.paramsControl);
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation
    return {
      headerTitle: '新建话题',
      //编辑
      headerRight: (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerTouch} onPress={() => navigation.state.params.navigatePress()}>
            <Image style={[styles.headerBtn, styles.headerImg]} source={require('../assets/images/public.png')} resizeMode='contain' />
          </TouchableOpacity></View>)
    }
  }

  componentWillReceiveProps(next) {
    const { topic_id, navigation, accesstoken } = this.props;
    if (next.topic_id && next.topic_id !== topic_id) {
      this.props.query({ topic_id: next.topic_id, accesstoken })
      navigation.goBack()
    }
  }

  componentWillUnmount() {
    // this.props.clean()
  }
  componentDidMount() {
    this.props.navigation.setParams({ navigatePress: this.publicButton, navigation: this.props.navigation, that: this })

  }

  publicButton() {
    const { navigate } = this.navigation;
    let self = this.that.state.paramsControl;
    if (self.isValidate().validate) {
      this.that.setState({ showLoading: true });
      try {
        BaseServiceApiNet.releaseVote(self.submitData())
          .then((response) => {
            if (response.hasOwnProperty('success')) {
              // setTimeout(() => {
              //     this.setState((state) => ({
              //         data: response.success,
              //         refreshing:false
              //     }));
              // }, 1000)
              navigate('Home', { staffType: "1" });
            } else {
              // this.that.setState({
              //     refreshing:false
              // });  
              Alert.alert("", response.error);
            }
            this.that.setState({ showLoading: false });
          }
        )
      } catch (e) {
        console.info(e);
      }
    }
    else {
      Alert.alert("错误提示", self.isValidate().message);
    }

  }


  render() {
    const { loading } = this.props
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps={true}>
        <StatusBar barStyle="light-content" />
        <Title setTitle={this.state.paramsControl.setTitle} setType={this.state.paramsControl.setType} />
        <AddList setItems={this.state.paramsControl.setItems} />
        <LoadingView showLoading={ this.state.showLoading } />
      </ScrollView >

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTouch: {
    height: 30
  },
  headerBtn: {
    flex: 1,
    width: 30,
    height: 30,
    marginRight: 10
  }
})

