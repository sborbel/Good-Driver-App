import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, ScrollView, Modal} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { gStyles } from '../styles/global';

export default class Faq extends Component{

    state = {
        display: false,
        data: ''
      }
    
      toggleModal(info) {
        this.setState(prevState => {
          return {
            display: true,
            data: info
          }
        });
      }

    render(){
        return (
            <ThemeContext.Consumer>{(ThemeContext) => {
                const {lightTheme} = ThemeContext;
                return(
                // replace these with a flat list you doof
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); console.log("keyboard dropped")}}>
                    <ScrollView> 
                        <Modal visible={ this.state.display } animationType = "fade"
                        onRequestClose={ () => console.log('closed') }>
                            <View style={lightTheme ? gStyles.lightBG : gStyles.darkBG}>
                                <Text style = {lightTheme ? gStyles.lightText : gStyles.darkText}>
                                    { this.state.data }
                                </Text>
                                <TouchableOpacity
                                    style={{ backgroundColor: "#2196F3" }}
                                        onPress={() => {
                                            this.setState({display: false})
                                    }}
                                >
                                    <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Is this an excellent question?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Heck yeah!')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Is this an even better question?</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Nah, the previous one was better')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Is this the best question?!</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Question 4</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Question 5</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Question 6</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Question 7</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Question 8</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Question 9</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Question 10</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Question 11</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal('Yes, this is an excellent question')}>
                            <View style={lightTheme ? gStyles.lightContain : gStyles.darkContain}>
                                <Text style={lightTheme ? gStyles.lightText : gStyles.darkText}>Question 12</Text> 
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableWithoutFeedback>                 
                )
            }}</ThemeContext.Consumer>
        )
    }
}