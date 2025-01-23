import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const HistoryList = (props) => {

    const completedTimers = Object.values(props?.route?.params)
        .flat()
        .filter(item => item.status=='Completed');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Completed Timer History</Text>
            <FlatList
                data={completedTimers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{flexDirection:'row',backgroundColor:'#fff',marginTop:10,justifyContent:'center',
                    alignItems:'center',borderRadius: 10,
                }}>
    <Image
            source={require('../assets/timer.jpg')}
            style={{height:80,width:80}}
            />                    
                 <View style={styles.logItem}>
                    <Text style={styles.timerName}>{item.name}</Text>
                    <Text style={styles.timerTime}>{item.duration} Sec</Text>
                    <Text style={styles.completedAt}>
                        Completed at: {new Date(item.completedAt).toLocaleString()}
                    </Text>
                </View>
                        </View>
                   
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No timers completed yet!</Text>}
            />
        </View>
    );
};

export default HistoryList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        color: '#000',
        textAlign: 'center',
    },
    logItem: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 8,
   
      
    },
    timerName: {
        fontWeight: '600',
        fontSize: 18,
        color: '#333',
    },
    timerTime: {
        color: '#777',
        fontSize: 14,
        marginTop: 5,
    },
    completedAt: {
        color: '#555',
        fontSize: 12,
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontSize: 16,
    },
});
