import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimerProgressBar = ({ duration, remainingTime }) => {
  const progressPercentage = ((duration - remainingTime) / duration) * 100;
  
  return (
    <View style={styles.progressContainer}>
      <View 
        style={[
          styles.progressBar, 
          { 
            width: `${progressPercentage}%`, 
            backgroundColor:"#43CEAD",
          }
        ]} 
      />
      <Text style={styles.progressText}>
        {Math.round(progressPercentage)}%
      </Text>
    </View>
  );
};



const styles = StyleSheet.create({
  progressContainer: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    margin:10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressBar: {
    height: '100%',
    borderRadius: 10
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold'
  }
});

export default TimerProgressBar;