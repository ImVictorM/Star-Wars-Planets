import React from 'react';
import App from '../App';
import { screen, act } from '@testing-library/react'
import renderWithProvider from '../helpers/renderWithProvider';
import fetchMockResults from '../helpers/fetchMockResults';

// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve(fetchMockResults),
//   })
// );



describe('', () => {
  // beforeEach(() => {
  //   fetch.mockClear();
  // });
 
  test('I am your test', () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(fetchMockResults),
    });
    renderWithProvider(<App />);
  });
})

