import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView, 
  Dimensions,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerProgressBar from './TimerProgress';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const STORAGE_KEY = '@timer_app_timers';
const WIDTH=Dimensions.get('screen').width

const Dashboard = () => {
  const [timers, setTimers] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const navigation=useNavigation()
  const [newTimer, setNewTimer] = useState({
    name: '',
    duration: '',
    category: ''
  });
  const [completedTimer, setCompletedTimer] = useState(null);
  const [showCreateTimerModal, setShowCreateTimerModal] = useState(false);

  useEffect(() => {
    loadTimers();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTimers();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timers]);

  const loadTimers = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTimers) {
        const parsedTimers = JSON.parse(storedTimers);
        setTimers(parsedTimers);
        const initialExpandedState = Object.keys(parsedTimers).reduce((acc, category) => {
          acc[category] = false;
          return acc;
        }, {});
        setExpandedCategories(initialExpandedState);
      }
    } catch (error) {
      console.error('Failed to load timers', error);
    }
  };

  const saveTimers = async (updatedTimers) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTimers));
    } catch (error) {
      console.error('Failed to save timers', error);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const addTimer = () => {
    const { name, duration, category } = newTimer;
    if (!name || !duration || !category) return;

    const updatedTimers = {...timers};
    
    updatedTimers[category] = updatedTimers[category] || [];
    updatedTimers[category].push({
      name,
      duration: parseInt(duration),
      remainingTime: parseInt(duration),
      status: 'Paused'
    });

    setExpandedCategories(prev => ({
      ...prev,
      [category]: true
    }));

    setTimers(updatedTimers);
    saveTimers(updatedTimers);
    setNewTimer({ name: '', duration: '', category: '' });
    setShowCreateTimerModal(false);
  };

  const updateTimers = () => {
    const updatedTimers = {...timers};
    let hasChanges = false;

    Object.keys(updatedTimers).forEach(category => {
      updatedTimers[category].forEach(timer => {
        if (timer.status === 'Running' && timer.remainingTime > 0) {
          timer.remainingTime -= 1;
          hasChanges = true;

          if (timer.remainingTime === 0) {
            timer.status = 'Completed';
            timer.completedAt = new Date().toISOString();  
            setCompletedTimer(timer);
          }
        }
      });
    });

    if (hasChanges) {
      setTimers(updatedTimers);
      saveTimers(updatedTimers);
    }
  };

  const controlTimer = (category, index, action) => {
    const updatedTimers = {...timers};
    const timer = updatedTimers[category][index];

    switch (action) {
      case 'start':
        timer.status = 'Running';
        break;
      case 'pause':
        timer.status = 'Paused';
        break;
      case 'reset':
        timer.remainingTime = timer.duration;
        timer.status = 'Paused';
        break;
    }

    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  };

  const controlCategoryTimers = (category, action) => {
    const updatedTimers = {...timers};
    
    updatedTimers[category].forEach(timer => {
      switch (action) {
        case 'start':
          if (timer.status !== 'Completed') {
            timer.status = 'Running';
          }
          break;
        case 'pause':
          timer.status = 'Paused';
          break;
        case 'reset':
          timer.remainingTime = timer.duration;
          timer.status = 'Paused';
          break;
      }
    });

    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  };

  const renderTimerInput = () => (
    <Modal
      visible={showCreateTimerModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Timer Name"
            value={newTimer.name}
            onChangeText={(text) => setNewTimer({...newTimer, name: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (seconds)"
            keyboardType="numeric"
            value={newTimer.duration}
            onChangeText={(text) => setNewTimer({...newTimer, duration: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={newTimer.category}
            onChangeText={(text) => setNewTimer({...newTimer, category: text})}
          />
          <View>
            
          </View>
          <View style={{flexDirection:'row',width:WIDTH*.8,justifyContent:'flex-end'}}>
          <TouchableOpacity
            onPress={() => setShowCreateTimerModal(false)}
            style={{backgroundColor:'#e5e5e5',padding:10,borderRadius:5,width:WIDTH*.3,alignItems:'center',}}>
              <Text style={{color:'#000'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={addTimer}
            style={{backgroundColor:'#43CEAD',padding:10,borderRadius:5,width:WIDTH*.3,alignItems:'center',marginLeft:10}}>
              <Text style={{color:'#fff'}}>Add Timer</Text>
              </TouchableOpacity>
          
       
          </View>
       
        </View>
      </View>
    </Modal>
  );
  const renderTimerList = () => (
    <ScrollView>
      {Object.entries(timers).map(([category, categoryTimers]) => (
        <View key={category} style={styles.categoryContainer}>
          <TouchableOpacity 
            style={styles.categoryHeader} 
            onPress={() => toggleCategory(category)}
          >
            <Text style={styles.categoryTitle}>
              {category} ({categoryTimers.length} timers)
            </Text>
            <Icon
                name={expandedCategories[category] ? 'remove-circle' : 'add-circle'} 
                size={30} 
                color="#333" 
            /> 
                     </TouchableOpacity>

          {expandedCategories[category] && (
            <View style={styles.categoryControls}>
            
                  <TouchableOpacity
        onPress={() => controlCategoryTimers(category, 'start')}
        style={{...styles.button,backgroundColor:'#e1e1e1'}}
      >
        <Text style={{...styles.buttonText,color:'#000'}}
        
        >Start All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => controlCategoryTimers(category, 'pause')}
        style={{...styles.button,backgroundColor:'#e1e1e1'}}
      >
        <Text style={{...styles.buttonText,color:'#000'}}
        >Pause All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => controlCategoryTimers(category, 'reset')}
        style={{...styles.button,backgroundColor:'#e1e1e1'}}
      >
        <Text style={{...styles.buttonText,color:'#000'}}
        >Reset All</Text>
      </TouchableOpacity>
             
              
            </View>
          )}

          {expandedCategories[category] && categoryTimers.map((timer, index) => (
            <View key={`${category}_${timer.name}`} style={styles.timerItem}>
              <View style={styles.timerHeader}>
                <Text style={styles.timerName}>{timer.name}</Text>
                <Text style={styles.timerStatus}>{timer.status}</Text>
              </View>
              <Text style={styles.timerTime}>
                {timer.remainingTime} seconds remaining
              </Text>

              <TimerProgressBar 
                duration={timer.duration} 
                remainingTime={timer.remainingTime} 
              />
            
              <View style={styles.timerControls}>
                

                
                {timer.status !== 'Running' && timer.status !== 'Completed' && (

<TouchableOpacity
                    onPress={() => controlTimer(category, index, 'start')}
                    style={styles.icon}
>
<Icon
                name={ 'play'} 
                size={30} 
                color="#fff"
            />
                        <Text style={{fontSize:8,color:'#fff'}}>Start</Text>

</TouchableOpacity>


                 
                )}
                {timer.status === 'Running' && (
                  <TouchableOpacity
                  onPress={() => controlTimer(category, index, 'pause')}
                  style={styles.icon}
>
<Icon
                name={ 'pause'} 
                size={30} 
                color="#fff"
            />
                        <Text style={{fontSize:8,color:'#fff'}}>Pause</Text>

</TouchableOpacity>
                
                )}

<TouchableOpacity
                  onPress={() => controlTimer(category, index, 'reset')}
                  style={styles.icon}
>
<Icon
                name={ 'stop-circle'} 
                size={30} 
                color="#fff"
            />
            <Text style={{fontSize:8,color:'#fff'}}>Reset</Text>
</TouchableOpacity>
                
              
              </View>
            </View>
          ))}
        </View>
      ))}
<TouchableOpacity style={{padding:15,}} onPress={()=>navigation.navigate('History',timers)}>
<Text style={{fontWeight:'bold',color:'black',}}>Explore timer History...</Text>

</TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Timer Management</Text>

      <Text style={{marginTop:10,padding:10}}>Create and manage your timers effortlessly. Track every seconds </Text>
      
      <TouchableOpacity
            onPress={() => setShowCreateTimerModal(true)}
            style={{backgroundColor:'#43CEAD',padding:10,borderRadius:5,width:100,alignItems:'center',marginLeft:10}}>
              <Text style={{color:'#fff'}}>Create timer</Text>
            </TouchableOpacity>
       
   
      {renderTimerInput()}
      {renderTimerList()}
      <Modal 
        visible={!!completedTimer}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
            source={require('../assets/timer.jpg')}
            style={{height:WIDTH*.45,width:WIDTH*.45}}
            />
            <Text style={{fontSize:18,margin:10}}>Timer Completed!</Text>
            <Text>{completedTimer?.name} has finished.</Text>
            <TouchableOpacity 
              title="Close" 
              style={{...styles.button,marginTop:10,alignSelf:'flex-end'}}
              onPress={() => setCompletedTimer(null)} 
            >
              <Text>Close</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  categoryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#000',
    padding: 10
  },
  inputContainer: {
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width:WIDTH*.85
  },
  categoryContainer: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 5
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#000'
  },
  timerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timerName: {
    fontWeight: 'bold'
  },
  timerStatus: {
    color: '#666'
  },
  timerTime: {
    marginVertical: 5
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  progressBar: {
    height: 10,
    backgroundColor: '#007bff',
    borderRadius: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderTopRightRadius:10,
    borderTopLeftRadius:10

  },
  icon:{
    backgroundColor: '#43CEAD',
    padding: 7,
    width:55,height:55,
    borderRadius: 2,
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10, 
  },
  button: {
    backgroundColor: '#43CEAD',
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10, 
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold', 
  },
});

export default Dashboard;
