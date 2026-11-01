/* eslint-disable @typescript-eslint/no-require-imports */
const React = require('react');
const { Text, View } = require('react-native');

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: (props) => React.createElement(Text, { testID: props.testID || `icon-${props.name}` }, props.name),
    MaterialIcons: (props) => React.createElement(Text, { testID: props.testID || `icon-${props.name}` }, props.name),
    MaterialCommunityIcons: (props) => React.createElement(Text, { testID: props.testID || `icon-${props.name}` }, props.name),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children),
    SafeAreaView: ({ children, style }: { children: React.ReactNode; style?: any }) =>
      React.createElement(View, { style }, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

// Suppress known React 19 test renderer act() warning in synthetic tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('overlapping act() calls')) {
    return;
  }
  originalConsoleError(...args);
};
