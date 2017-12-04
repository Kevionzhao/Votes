import React, { PureComponent } from 'react';
import { StyleSheet, Alert, View, Text, ActivityIndicator, TextInput, RefreshControl, Button, Image, StatusBar, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import RadioModal from 'react-native-radio-master';
import Setting from '../config/setting';
import BaseServiceApiNet from '../utils/baseServiceApiNet';
import CheckBox from 'react-native-check-box';
import LoadingView from '../utils/loadingView';

const { width } = Dimensions.get('window')
const defaultMaxImageWidth = width - 30 - 20
const defaultInputWidth = width - 40
const arrayObj = new Array();

export default class Details extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
        initId:'',
				datas:'',
				type:'',
				description:'',
				isModified:false,
				isLoading:false,
				subDescription:'',
				sendMsg:'',
				isChecked:false,
				showLoading:false
		},
		_that = this;
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams,navigate } = navigation;
    const { params } = navigation.state;
    return {
      headerTitle: params.title,
      headerRight: (
        <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerTouch} onPress={() => navigation.state.params.navigatePress()}>
          <Image style={[styles.headerBtn, styles.headerImg]} source={require('../assets/images/public.png')} resizeMode='contain' />
        </TouchableOpacity>
      </View>
      )
    };
  };
	componentDidMount() {
		this.props.navigation.setParams({navigatePress:this.submitVote,navigation:this.props.navigation})
	
	}

  componentWillMount() {
		//请求details数据
		const {state,navigate} = this.props.navigation;
		arrayObj = new Array();
		try{
			BaseServiceApiNet.getVoteListDetails(state.params.topic_id).then((response) => {
				this.setState({
					isLoading:true
				})
				console.info(response)
				if(response.hasOwnProperty('success')){
						setTimeout(() => {
								this.setState((state) => ({
										datas:response.success.items,
										type:response.success.type,
										description:response.success.description,
										subDescription:response.success.items,
										isLoading:false
								}));
						}, 3000)
					}else{
						this.setState({
							isLoading:false
						});  
						Alert.alert("错误提示",response.error,[{text:"重新输入"}]); 
					}
		})}catch(e){
		console.info(e);
		}
	}
	submitVote(){
	 const{navigate,state} = this.navigation; 
	 Array.prototype.remDub = Array.prototype.remDub || function () {
		return [...new Set(this)];
		};

		if(0 == arrayObj.remDub().length){
			return	Alert.alert("","请勾选选项进行投票",[{text:"重新选择"}]); 
		}
		_that.setState({
			showLoading:true
		});
    try {
			var formData = {
				actionId : "VOTE",
				items : arrayObj.remDub()
			}
      BaseServiceApiNet.sentPublicVote(this.topic_id,formData)
      .then((response) => {
        if(response.hasOwnProperty("success")){
					setTimeout(() => {	
					Alert.alert('', '投票成功', [
            {
              text: '点击返回',
              onPress: function() {
								navigate("Home",{staffType:"0"})
              }
            },
					])},0)
        }else{
					setTimeout(() => {
						Alert.alert("",response.error,[{text:"投票失败"}]); 
				}, 0)
					
				}
				_that.setState((state) => ({
					showLoading:false
				}));	
      })
  } catch(e) {
		alert(e);
    }
	}
	//check box start
	renderViews = () => {
		if (!this.state.datas || this.state.datas.length === 0)return;
		let len = this.state.datas.length;
		var views = [];  //要绘制的所有多选框，装入views数组
		for (let i = 0, j = len - 2; i < j; i += 2) {
				views.push((
						<View key={`view_${i}`} style={{flexDirection: 'row'}}>
								{this.renderCheckBox(this.state.datas[i])}
								{this.renderCheckBox(this.state.datas[i + 1])}
						</View>
				));
		}

        //偶数个，剩下最后两个多选框
        //奇数个，剩下最后一个多选框
        views.push(
					<View key={`view_${len - 1}`} style={{flexDirection: 'row'}}>
							{len % 2 === 0 ? this.renderCheckBox(this.state.datas[len - 2]) :
									<View style={{flex: 1, padding: 10}}></View>}
							{this.renderCheckBox(this.state.datas[len - 1])}
					</View>
			);

			return views;
	}
	handleClick = (item) => {
		item.checked = !item.checked;
		if(item.checked){
			arrayObj.push(item._id);
		}else{
			console.info(item)
			arrayObj = arrayObj.filter(function(e,index){
				console.log(e==item._id)
				return item._id!=e;
			});
		}
}

handleOnChange = (id) => {
	var arr=new Array();	
	arr.push(id);
	arrayObj=[...arr];
}

//渲染CheckBox  这里item就是一个对象
renderCheckBox = (item) => {
		console.log(item);

		// console.log(item.name + ',' + item.checked);
		var leftText = item.description;
		return <CheckBox
				style={{flex: 1, padding: 10}}
				onClick={() => this.handleClick(item)}
				leftText={leftText}
				isChecked = {(item.checked)}
				unCheckedImage={<Image source={require('../assets/images/ic_check_box_outline_blank.png')}
															 style={styles.checkbox}/>}
				checkedImage={<Image source={require('../assets/images/ic_check_box.png')} style={styles.checkbox}/>}
		/>
}
//check box end
  render() {
		const { loading } = this.props
    return (     
        <View style={styles.container}>
						<ActivityIndicator  animating={this.state.isLoading}  /> 			 
            <Text>{this.state.description}</Text>
						 {this.state.type=='0'?
							<RadioModal
								options={{id:'_id',value:'description'}}
								innerStyle={{width:(width-80)/2}}
								txtColor={'#000000'}
								noneColor={'#efefef'}
								onValueChange={(id,item) => this.handleOnChange(id)}
								seledImg={require('../assets/images/selected.png')}
								selImg={require('../assets/images/select.png')}
								selnoneImg={require('../assets/images/selectnone.png')}
								dataOption={this.state.datas}
								style={{flexDirection:'row',
								flexWrap:'wrap',
								alignItems:'flex-start',
								flex:1,
								backgroundColor:'#ffffff',
								padding:5,
								marginTop:10}} 
				      />
						 :	 
							<View style={('' == this.state.datas)?null:{flexDirection:'row',
								flexWrap:'wrap',
								alignItems:'flex-start',
								flex:1,
								backgroundColor:'#ffffff',
								padding:5,
								marginTop:10}}>
								{('' == this.state.datas)?null:this.renderViews()}
							</View>
						 }
						 <LoadingView showLoading={ this.state.showLoading } />
				</View>
    );
	}
	
}

const styles = StyleSheet.create({
	container:{
		padding:20,
		flex:1,
		flexDirection:'column',
	//	backgroundColor: '#F8F8F8',
	},
	checkbox: {
				tintColor: '#63B8FF'
		},
	checkboxView:{flex: 1, padding: 10},	
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
});


