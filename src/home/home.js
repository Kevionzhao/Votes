import React, { PureComponent } from 'react';
import Wrap from './components/wrap';
import { BackAndroid, ToastAndroid, StyleSheet,AsyncStorage, AlertIOS, View, Text, Button, Image, StatusBar, FlatList, Dimensions, TouchableOpacity, Alert } from 'react-native'
import Setting from '../config/setting';
import BaseServiceApiNet from '../utils/baseServiceApiNet';
const { width } = Dimensions.get('window')
export default class Home extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false, //初始化不刷新
            loadNew:"",
            _newData:"",
            staffType:'0'
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
            headerRight: (
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerTouch} onPress={() => navigation.state.params.navigatePress()}>
                        <Text style={styles.exitText}>退出</Text>
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: null,
            headerTitle: '投票列表',
        }
    };
    LogoffButton(){
        const{navigate} = this.navigation; 
        Alert.alert('', '确定退出？', [
            {
              text: '取消',
              onPress: function() {
                console.log('取消按钮点击');
              }
            },
            {
              text: '确认',
              onPress: function() {              
                AsyncStorage.removeItem("_token")
                {navigate('Login')}
              }
            },
          ])
    }  
   
    componentDidMount() {
        this.props.navigation.setParams({navigatePress:this.LogoffButton,navigation:this.props.navigation})
        const{navigate} = this.props.navigation;      
    try{
          BaseServiceApiNet.getVoteList().then((response) => {
            this.setState({
                refreshing:true
            })
            if(response.hasOwnProperty('success')){
                setTimeout(() => {
                    this.setState((state) => ({
                        data: response.success,
                        refreshing:false
                    }));
                }, 2000)
              }else{
                this.setState({
                    refreshing:false
                });  
                Alert.alert("",response.error,[{text:"信息加载失败，重新登陆"}]);
              }
        })}catch(e){
        console.info(e);
    }
}

    _onEndReached = () => {
        //请求新数据
        try{
            BaseServiceApiNet.getVoteList().then((response) => {
              this.setState({
                  refreshing:true
              })
              if(response.hasOwnProperty('success')){
                  setTimeout(() => {
                      this.setState((state) => ({
                          data: response.success,
                          refreshing:false
                      }));
                  }, 3000)
                }else{
                  this.setState({
                      refreshing:false
                  });  
                  Alert.alert("",response.error,[{text:"获取新数据失败！重新登陆"}]); 
                }
          })}catch(e){
          console.info(e);
      }
    }
    _footer = () => (
        <Text style={{fontSize: 14, alignSelf: 'center',marginTop:10, color:"grey"}}>{this.state.loadNew}</Text>
      )
    render() {
        const { navigate,state } = this.props.navigation;
        this.setState({
            staffType:state.params.staffType
        });
        const tabs = [{ key: 'all', value: '全部' }]
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <FlatList
                    ref="_flatlist"
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={(item, index) => item.id}
                    ListFooterComponent={this._footer}//footer尾部组件
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this._onEndReached();
                        this.setState({ refreshing: true })//开始刷新
                        setTimeout(() => {
                            this.setState({ refreshing: false, loadNew:"暂时没有更多新数据"});
                        }, 1000);
                    }}
                    renderItem={({ item }) => <Wrap navigate={navigate} item={item} staffType={state.params.staffType}/>}
                />
                {this.state.staffType=='1'?
                <TouchableOpacity style={styles.pubilshBox} onPress={() => { navigate('Publish') }}>
                    <Image style={styles.pubilsh} source={require('../assets/images/add.png')} resizeMode='contain' />
                </TouchableOpacity>:null
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },

    headerLeft: {
        height: 44,
        width: 80,
        marginLeft: 15
    },

    headerRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },

    headerTouch: {
        height: 30,
        justifyContent: 'center',
    },
    exitText: {
        color: 'white',
    },
    headerBtn: {
        flex: 1,
        width: 30,
        height: 30,
        marginRight: 15
    },

    iconBtn: {
        width: 25,
        height: 25,
    },

    headerImg: {
        borderRadius: 15,
    },

    pubilshBox: {
        position: 'absolute',
        bottom: 15,
        right: 15,
    },

    pubilsh: {
        width: 44,
        height: 44,
    },

    tabsView: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 0.5,
        borderColor: '#F0F0F0',
    },

    tabView: {
        padding: 15,
    },

    tabText: {
        fontSize: 14,
    },

    tabActive: {
        borderBottomWidth: 1.5,
        borderColor: '#4181DE',
    },

    textActive: {
        fontWeight: 'bold',
        color: '#4181DE',
    }

});

