import React from 'react';
import App from '../App';
import renderWithProvider from '../helpers/renderWithProvider';
import fetchMockResults from '../helpers/fetchMockResults';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fetchMockResults),
  })
);

describe('', () => {
  // beforeEach(() => {
  //   fetch.mockClear();
  // });

  test('I am your test', () => {
    renderWithProvider(<App />);
  });
})

