import React from 'react';
import App from '../App';
import { screen, act, waitFor } from '@testing-library/react'
import renderWithProvider from '../helpers/renderWithProvider';
import fetchMockResults from '../helpers/fetchMockResults';

describe('Testa a renderização', () => {
  const PLANET_NAME_TEST_ID = "planet-name";
  const PLANETS_TABLE_TEST_ID = "planets-table";
  beforeEach( async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(fetchMockResults),
    });
    renderWithProvider(<App />);
    await screen.findAllByTestId(PLANET_NAME_TEST_ID);
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  test('As informações da tabela renderizam corretamente', () => {
    const table = screen.getByTestId(PLANETS_TABLE_TEST_ID);
    const headerColums = screen.getAllByRole('columnheader');
    const rows = screen.getAllByTestId(PLANET_NAME_TEST_ID);

    expect(table).toBeInTheDocument();
    expect(rows).toHaveLength(3)
    expect(headerColums).toHaveLength(13);
  });
});


describe('Testa bad request', () => {
  test('Imprime erro no console quando a api não retorna o valor esperado', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error));
    const logSpy = jest.spyOn(console, 'log');
    renderWithProvider(<App />);
    await waitFor(() => expect(global.fetch).rejects);
    expect(logSpy).toHaveBeenCalledWith(new Error);
  });
});

