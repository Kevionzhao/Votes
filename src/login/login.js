import React, { PureComponent } from 'react';
import {BackAndroid, ToastAndroid,AsyncStorage, StyleSheet ,ScrollView, View, Text, ActivityIndicator, TextInput, Button, Image, StatusBar, FlatList, Dimensions, TouchableOpacity,Alert } from 'react-native'
import BaseServiceApiNet from '../utils/baseServiceApiNet';
import Setting from '../config/setting';
var forge = require('node-forge');
import LoadingView from '../utils/loadingView';

export default class Login extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { 
      text: '' ,
      isLoading:false, 
      showLoading:false,
    }
  }
//backlisten start
  componentWillMount(){      
             BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);       
    }      
    componentWillUnmount() {       
             BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);       
    }      
    onBackAndroid = () => { 
             if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {      
                return false;      
              }      
              this.lastBackPressed = Date.now();      
              ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);       
              return true;    
    };
//backlisten end

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    return {
      headerTitle: 'Vote',
      headerLeft: null,
      headerRight: null,
    }
  };
  _onLogin = (userName,password) => {
    const { navigate } = this.props.navigation;
    that = this;
    if(false){
      navigate('Home',{staffType:'0'});
      return;
    }
    if(this.state.showLoading==true){
      return;
    }
    if((!!userName)&& (!!password)){
        var md = forge.md.md5.create();
        md.update(password);
        this.setState({
          isLoading:true,
          showLoading:true
        });
    try{
        BaseServiceApiNet.getUserInfo({
          staffId : userName,
          password : md.digest().toHex().toUpperCase()
        }).then((response) => {
          console.info(response)
           setTimeout(() => {
            if(response.hasOwnProperty('success')){
              console.info(response.success._token)
              this.setState({
                isLoading:false,
                showLoading:false
              });  
              navigate('Home',{staffType:response.success.staffType});
            }else{
              Alert.alert("",response.error);
            }}, 500)
            this.setState({
              isLoading:false,
              showLoading:false
            });   
          })
        }catch(e){
          console.info(e);
        }
    }else{
      this.setState({
        isLoading:false,
        showLoading:false
      });
      Alert.alert("错误提示","帐号或者密码不能为空",[{text:"重新输入"}]);              
    }
  }
   
  render() {
    const { loading, navigation } = this.props
    return (
      <ScrollView ref='scroll'> 
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.logoView}>
          <Image style={styles.logo} source={require('../assets/images/logon1.png')} resizeMode='contain' />
        </View>
        <Text style={styles.label}>用户名</Text> 
        
        
        <View style={styles.inputView}>         
          <TextInput style={styles.input}
            value={this.state.username}
            placeholder='输入用户名'
            maxLength={13}
            underlineColorAndroid="transparent"
            onChangeText={(username) => { this.setState({ username }) }}
          />
        </View>
        <Text style={styles.label}>密码</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.input}
            value={this.state.password}
            placeholder='输入密码'
            secureTextEntry={true}
            maxLength={13}
            underlineColorAndroid="transparent"
            onChangeText={(password) => { this.setState({ password }) }}
          />
        </View>
        {/* <ActivityIndicator  animating={this.state.isLoading}  /> */}
        <TouchableOpacity animating={this.state.isLoading} style={styles.loginBtn} onPress={() => { this._onLogin(this.state.username,this.state.password) }}>
          <Text style={styles.login}>登录</Text>
        </TouchableOpacity>
        <LoadingView showLoading={ this.state.showLoading } />
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  bgImageWrapper: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0
  },

  bgImage: {
    flex: 1,
    resizeMode: "stretch"
  },

  logoView: {
    alignItems: 'center',
    margin: 15,
    marginBottom: 0,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },

  logo: {
    width: 340,
    height:190
  },

  inputView: {
    height: 44,
    margin: 15,
    marginBottom: 0,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  input: {
    fontSize: 14,
    paddingLeft: 15,
    paddingRight: 15,
  },
  loginBtn: {
    padding: 15,
    margin: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0079FD',
  },

  login: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginLeft: 16,
    marginTop: 16,
  }
});
