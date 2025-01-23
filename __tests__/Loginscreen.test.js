import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginScreen from '../screens/LoginScreen'; 
const mockStore = configureStore([]);

describe('LoginScreen', () => {
  let store;
  let navigationMock;

  beforeEach(() => {
    store = mockStore({
      login: '', 
    });

    store.dispatch = jest.fn();

    navigationMock = {
      navigate: jest.fn(),
    };
  });

  test('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigationMock} />
      </Provider>
    );

    expect(getByText('GitHub User Search')).toBeTruthy();
    expect(getByLabelText('Enter GitHub Username')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
  });

  test('updates input value', () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigationMock} />
      </Provider>
    );

    const input = getByLabelText('Enter GitHub Username');

    fireEvent.changeText(input, 'new-user');
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'setLogin', payload: 'new-user' });
  });

  test('navigates to Results on submit', () => {
    store = mockStore({
      login: 'test-user',
    });

    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigationMock} />
      </Provider>
    );

    const button = getByText('Search');
    fireEvent.press(button);

    expect(store.dispatch).toHaveBeenCalledWith({ type: 'resetUsers' });
    expect(navigationMock.navigate).toHaveBeenCalledWith('Results');
  });
});
