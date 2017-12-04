import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Modal, Dimensions, TouchableOpacity, FlatList,ScrollView } from 'react-native';

export default class AddList extends Component {
    constructor(props) {
        super(props);
            this.state = {
            items: [
            ],
            content:''
        }
    }

    addItem() {
        let items = this.state.items; 
        let id = this.getId();
        let item = { id:id,value:""};
        items = [...items, item];
        this.props.setItems(items);                
        this.setState({ items: items});
    }
    // 获得子组件的值  
    setItemValue(content,id) {       
        let items = this.state.items;
            items = items.filter(function(e,i){
                if(e.id==id){
                    e.value = content;
                }
                return true;
            });       
         this.props.setItems(items);
    }

    delItem(index) {
        let items = this.state.items;
        items = items.filter(function(e, i){
            return index!=e.id;
        })
        this.props.setItems(items);
        this.setState({ items: items });
    };
    
    getId(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          }).toUpperCase();
      }

    render() {
        const { content } = this.props;
        const { height } = Dimensions.get('window');
        const textareaHeight = height - 64 - 74 - 35 - 260;
        const { items } = this.state;
        return (
            <ScrollView style={styles.container}>
            <FlatList
                data={items}              
                renderItem={({ item,index }) =>
                        <View style={styles.titleView}>                   
                        <TextInput key= {item.id} style={styles.input}
                            value={content}
                            placeholder='输入内容'
                            underlineColorAndroid="transparent"
                            onChangeText={(content) => { this.setItemValue(content,item.id) }}
                            >
                        </TextInput>
                        <TouchableOpacity onPress={() => { this.delItem(item.id) }}>
                            <View style={styles.tabView}>
                            <Text>删除</Text>
                            </View>
                        </TouchableOpacity> 
                        </View>           
                }
            />            
            <TouchableOpacity animating={this.state.isLoading} style={styles.addBtn} onPress={() => { this.addItem() }}>
                <Text style={styles.addlist}>添加选项</Text>
            </TouchableOpacity>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    addBtn: {
        padding: 15,
        margin: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0079FD',
      },
    
      addlist: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
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
});
