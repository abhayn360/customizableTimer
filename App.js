import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HistoryList from './src/Components/HistoryList';
import Dashboard from './src/Components/Dashboard';
import { Appearance } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => Appearance.setColorScheme('light'),
  [])
  return (
      <NavigationContainer>
        <Stack.Navigator>
         
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false, statusBarHidden: true }}
          />
            <Stack.Screen
            name="History"
            component={HistoryList}
            options={{ headerShown: false, statusBarHidden: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
