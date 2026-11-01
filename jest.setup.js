/* eslint-disable @typescript-eslint/no-require-imports */
const React = require('react');
const { Text } = require('react-native');

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: (props) => React.createElement(Text, { testID: props.testID || `icon-${props.name}` }, props.name),
    MaterialIcons: (props) => React.createElement(Text, { testID: props.testID || `icon-${props.name}` }, props.name),
    MaterialCommunityIcons: (props) => React.createElement(Text, { testID: props.testID || `icon-${props.name}` }, props.name),
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
