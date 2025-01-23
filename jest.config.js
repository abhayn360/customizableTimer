module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '@babel/jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-paper|@react-native-community|@react-native-picker|@expo|expo))',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
