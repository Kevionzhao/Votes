import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, StatusBar, FlatList, Dimensions, TouchableOpacity,ScrollView } from 'react-native'
export default class Search extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { data: this.props
    }
    _data = this._sourceData;
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    return {
      headerTitle: '搜索'
    };
  };

  render() {
    const { navigate,state } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Welcome back: {state.params.username}</Text> 
        <View style={styles.container}>
        <TextInput style={{height:50,borderColor:'red',borderWidth:1,marginTop:64}}
                        underlineColorAndroid="transparent"
                        maxLength={20} 
                        placeholder={'输入电影名字搜索'}
                        onChangeText={this.onChanegeTextKeyword.bind(this)}>
               
         </TextInput>   
        <FlatList
          data={this.state.data}
          //使用 ref 可以获取到相应的组件
          ref={(flatList) => this._flatList = flatList}
          ListHeaderComponent={this._header}//header头部组件
          ListFooterComponent={this._footer}//footer尾部组件
          ItemSeparatorComponent={ItemDivideComponent}//分割线组件
          //空数据视图,可以是React Component,也可以是一个render函数，或者渲染好的element。
          ListEmptyComponent={this.createEmptyView()}
          keyExtractor={this._keyExtractor}
          //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
          //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
          //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
          getItemLayout={(data, index) => ( {length: 44, offset: (44 + 1) * index, index} )}
          //决定当距离内容最底部还有多远时触发onEndReached回调。
          //注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
          onEndReachedThreshold={0.1}
          //当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用
          onEndReached={({distanceFromEnd}) => (
            setTimeout(() => {
              this.setState((state) => ({
                data: state.data.concat(this._newData),
              }));
            }, 3000)
          )}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setState({refreshing: true})//开始刷新
            //这里模拟请求网络，拿到数据，3s后停止刷新
            setTimeout(() => {
              alert('没有可刷新的内容！');
              this.setState({refreshing: false});
            }, 3000);
          }}
          renderItem={this._renderItem}
        />
         <TouchableOpacity style={styles.pubilshBox} onPress={() => { navigate('Publish') }}>
          <Image style={styles.pubilsh} source={require('../assets/images/add.png')} resizeMode='contain' />
        </TouchableOpacity>
      
         </View>
      </View>
    )
  }

  //改变搜索的文本
  onChanegeTextKeyword(text){
    
           this.timeA(text);
      }
      //利用防抖方式防止数据过大造成卡顿现象
      timeA(text){
         if(this.time){
           clearTimeout(this.time)
         }
         
         this.time = setTimeout(()=>{
                  if (text==='') {
                        this.setState({
                          data:_data,
                          });      
                        return;
                 }else{
                      for (var i = 0; i < _data.length; i++) {
                         if (_data[i].name===text) {
                              this.setState({
                                   data:[_data[i]],
                              });
                          return;
                  }else{
                       this.setState({
                             data:[],
                        });
                  }
             }
           }
          },500);
          
      }
      //点击城市cell
      cityClicked(item){
        
      }
      //列表的每一行
      renderItemView({item,index}){
        return(
          <TouchableOpacity style={{flex:1,
                                    height:60,
                                    backgroundColor:'orange',
                            }}
                            onPress={()=>{this.cityClicked(item)}}
                           >
            <View style={{backgroundColor:'green',
                          height:59,justifyContent: 'center',
                          alignItems: 'center'}}>
               <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        );
      }
      //去除警告
      extraUniqueKey(item,index){
        return index+item;
      }
  //此函数用于为给定的item生成一个不重复的key
  //若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标index。
  _keyExtractor = (item, index) => index;
  
    itemClick(item, index) {
      const { data, navigation } = this.props;
      navigation.navigate('Publish');
  }
  
    _renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.itemClick.bind(this, item, index)}>
          <Text style={styles.item}>{item.name}</Text>
        </TouchableOpacity>
      );
    }
    _header = function () {
      return (
        <Text style={{fontWeight: 'bold', fontSize: 20}}>热门电影</Text>
      );
    }
  
    _footer = () => (
      <Text style={{fontSize: 14, alignSelf: 'center'}}>到底啦，没有啦！</Text>
    )
  createEmptyView() {
    return (
      <Text style={{fontSize: 40, alignSelf: 'center'}}>还没有数据哦！</Text>
    );
  }

}

class ItemDivideComponent extends PureComponent {
  render() {
    return (
      <View style={{height: 1, backgroundColor: 'skyblue'}}/>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
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
    backgroundColor: '#282828',
  },

  logo: {
    width: 200,
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
    marginRight: 15
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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
});
