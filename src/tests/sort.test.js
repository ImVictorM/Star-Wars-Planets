import React from 'react';
import App from '../App';
import { screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import renderWithProvider from '../helpers/renderWithProvider';
import fetchMockResults from '../helpers/fetchMockResults';

describe('Testa ordenação', () => {
  const PLANET_NAME_TEST_ID = "planet-name";
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

  test('É possivel ordenar as informações da tabela de forma ascendente', () => {
    const sortOption = screen.getByRole('combobox', {
      name: /ordernar/i,
    });
    const ascendentRadio = screen.getByRole('radio', {
      name: /ascendente/i,
    });
    const sortButton = screen.getByRole('button', {
      name: /ordenar/i,
    });

    expect(sortOption).toHaveValue('population');
    expect(ascendentRadio).not.toBeChecked();
    expect(sortButton).toBeEnabled();

    act(() => {
      userEvent.click(ascendentRadio);
      userEvent.click(sortButton);
    });

    const rows = screen.getAllByTestId(PLANET_NAME_TEST_ID);
    expect(rows[0]).toHaveTextContent(/Yavin IV/i);
    expect(rows[1]).toHaveTextContent(/Tatooine/i);
    expect(rows[2]).toHaveTextContent(/Alderaan/i);
  });

  test('É possivel ordenar as informações da tabela de forma descendente', () => {
    const sortOption = screen.getByRole('combobox', {
      name: /ordernar/i,
    });
    const descendentRadio = screen.getByRole('radio', {
      name: /descendente/i,
    });
    const sortButton = screen.getByRole('button', {
      name: /ordenar/i,
    });
    expect(sortOption).toHaveValue('population');
    expect(descendentRadio).not.toBeChecked();
    expect(sortButton).toBeEnabled();

    act(() => {
      userEvent.click(descendentRadio);
      userEvent.click(sortButton);
    });

    const rows = screen.getAllByTestId(PLANET_NAME_TEST_ID);
    expect(rows[0]).toHaveTextContent(/Alderaan/i);
    expect(rows[2]).toHaveTextContent(/Yavin IV/i);
    expect(rows[1]).toHaveTextContent(/Tatooine/i);
  });

  test('ordena os valores unknown para ultima posição', () => {
    const sortOption = screen.getByRole('combobox', {
      name: /ordernar/i
    });
    const descendentRadio = screen.getByRole('radio', {
      name: /descendente/i
    });
    const sortButton = screen.getByRole('button', {
      name: /ordenar/i
    });

    act(() => {
      userEvent.selectOptions(sortOption, 'diameter');
      userEvent.click(descendentRadio);
      userEvent.click(sortButton);
    });

    const rows = screen.getAllByTestId(PLANET_NAME_TEST_ID);
    expect(rows[0]).toHaveTextContent(/Alderaan/i);
    expect(rows[2]).toHaveTextContent(/Yavin IV/i);
    expect(rows[1]).toHaveTextContent(/Tatooine/i);
  });

});