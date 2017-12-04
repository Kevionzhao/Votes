
import React from 'react'
import { StyleSheet, Alert,View, Image, Text, TouchableHighlight } from 'react-native'
function Wrap({ item, navigate , staffType}) {
  return (
    <View style={styles.container}>
    <TouchableHighlight  onPress={() => {{staffType=='1'?Alert.alert("",'SmartOA暂时不能对您提供投票的服务，查看更多投票信息请访问Admin主页'):navigate('Details', { topic_id: item._id, title:item.title })} }}>
      <View style={styles.list}>
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.h3}>{item.title}</Text>
        </View >
        <View style={styles.content}>
          <View style={styles.info}>
            <View style={styles.p}>
              <Text style={styles.name}>{item.description}</Text>
              {staffType=='1'?
              <View style={styles.status}>
                <Text style={[styles.b, styles.reply]}>已投{item.votersCount} </Text>
                {/* <Text style={styles.b}>共{item.totalperson}</Text> */}
              </View>:null}
            </View>
            <View style={styles.p}>
              <Text style={styles.time}>发布于：{new Date(item.createTime).toLocaleDateString()}</Text>
              <Text style={styles.time}>截止于：{new Date(item.endTime).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
      </View >
    </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
},
  list: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0'
  },

  header: {
    flex: 1,
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row'
  },

  tab: {
    marginRight: 10,
    paddingTop: 5,
    paddingLeft: 6,
    paddingBottom: 5,
    paddingRight: 6,
    borderRadius: 3,
  },

  sort: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  h3: {
    flex: 1,
    overflow: 'hidden',
    fontSize: 16,
    fontWeight: 'bold',
  },

  top: {
    backgroundColor: '#e74c3c',
  },

  ask: {
    backgroundColor: '#3498db',
  },

  good: {
    backgroundColor: '#e67e22',
  },

  share: {
    backgroundColor: '#1abc9c',
  },

  job: {
    backgroundColor: '#6A8FFF',
  },

  dev: {
    backgroundColor: '#7A86A2',
  },

  default: {
    backgroundColor: '#e7e7e7',
  },

  content: {
    paddingTop: 10,
    flexDirection: 'row'
  },

  info: {
    flex: 1,
  },

  p: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
  },

  status: {
    flexDirection: 'row',
  },

  name: {
    fontSize: 12,
  },

  time: {
    fontSize: 12,
  },

  b: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  reply: {
    color: '#42b983',
  }
});

export default Wrap
