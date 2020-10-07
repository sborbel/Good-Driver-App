import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';

export const gStyles = StyleSheet.create({
    errorText: {
        color: 'crimson',
    },
    darkBG: {
        backgroundColor: '#1e1e2f',
        flex: 1,
    },
    lightBG: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    darkText: {
        color: '#f2f2f2',
        fontSize: 24,
        padding: 20,
        fontWeight: "bold"
    },
    lightText: {
        color: '#000000',
        fontSize: 24,
        padding: 20,
        fontWeight: "bold"
    },
    darkSubText: {
        color: '#f2f2f2',
        fontSize: 18,
        paddingRight: 20,
        paddingLeft: 20,
    },
    lightSubText: {
        color: '#000000',
        fontSize: 16,
        paddingRight: 20,
        paddingLeft: 20,
    },
    lightContain: {
        padding: 5, 
        borderColor: 'gray', 
        borderWidth: 1,
        backgroundColor: '#ffff00',
    },
    darkContain: {
        padding: 5, 
        borderColor: 'gray', 
        borderWidth: 1,
        backgroundColor: '#1e1e2f',
    },
    
});