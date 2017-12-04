import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Login from './login/login';
import Home from './home/home';
import Publish from './publish/publish';
import Details from './details/details';
import AddList from './publish/components/AddList'
import Title from './publish/components/Title'


const Tabs = TabNavigator({
  Login: { screen: Login },
  
}, {
    tabBarOptions: {
      activeTintColor: '#7a86a2',
      style: {
        backgroundColor: '#fff',
      },
    },
    lazy: true,                     //懒加载
    swipeEnabled: false,
    animationEnabled: false,        //关闭安卓底栏动画
    tabBarPosition: 'bottom',
    tabBarComponent: TabBarBottom,  //解决安卓底栏不显示图标问题
  });

const Navigation = StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home },
  Publish : {screen : Publish},
  Details :{screen : Details},
  AddList :{screen : AddList},
  Title :{screen : Title},

}, {
    initialRouteName: 'Login',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#2D2D2D',
      },
      headerBackTitle: null,
      headerTintColor: '#FFFFFF',
    },
    transitionConfig: () => ({
      screenInterpolator: CardStackStyleInterpolator.forHorizontal, // 安卓导航进入 左右方式
    }),
    headerMode: 'screen'
  });

export default Navigation;