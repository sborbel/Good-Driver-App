import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Point app for point things... and other things</Text>
      <Text>This is Yellow now. To check if pushes will work right</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff333',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
