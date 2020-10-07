import React from 'react'
import { Modal, View, Text, StyleSheet } from 'react-native';

const MessageModal = (props) => (
  <Modal visible={ props.display } animationType = "fade"
         onRequestClose={ () => console.log('closed') }>
    <View>
        <Text style = { styles.text }>
            { props.data }
        </Text>
        <TouchableHighlight
            style={{ backgroundColor: "#2196F3" }}
                onPress={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <Text style={styles.textStyle}>Hide Modal</Text>
        </TouchableHighlight>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginLeft: 150
  }
})

export default MessageModal;