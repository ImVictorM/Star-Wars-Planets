import React from 'react';
import App from '../App';
import { screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import renderWithProvider from '../helpers/renderWithProvider';
import fetchMockResults from '../helpers/fetchMockResults';

describe('Testa filtros', () => {
  const PLANET_NAME_TEST_ID = "planet-name";
  const COLUMN_FILTER_TEST_ID = "column-filter";
  const COMPARISON_FILTER_TEST_ID = "comparison-filter";
  const VALUE_FITER_TEST_ID = "value-filter";
  const FILTER_BUTTON_TEST_ID = "button-filter";
  const FILTER_TEST_ID = "filter";
  const DELETE_FILTER_TEST_ID = "delete-filter";

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

  test('É possível filtrar os planetas por nome', async () => {
    renderWithProvider(<App />);
    const nameInput = screen.getByRole('textbox', {
      name: /nome do planeta/i
    });
    expect(nameInput).toHaveValue('');

    act(() => {
      userEvent.type(nameInput, 'oo');
      expect(nameInput).toHaveValue('oo');
    });

    const rows = await screen.findAllByTestId(PLANET_NAME_TEST_ID);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(/Tatooine/i);
  });

  test('É possivél adicionar um filtro por coluna', () => {
    const columFilter = screen.getByTestId(COLUMN_FILTER_TEST_ID);
    const operator = screen.getByTestId(COMPARISON_FILTER_TEST_ID);
    const valueFIlter = screen.getByTestId(VALUE_FITER_TEST_ID);
    const filterButton = screen.getByTestId(FILTER_BUTTON_TEST_ID);

    expect(columFilter.value).toEqual('population');
    expect(operator.value).toEqual('maior que');
    expect(valueFIlter.value).toEqual('0');
    expect(filterButton).toBeEnabled();

    act(() => {
      userEvent.selectOptions(columFilter,'rotation_period');
      userEvent.type(valueFIlter, '23');
      userEvent.click(filterButton);
    });
    
    const planets = screen.getAllByTestId(PLANET_NAME_TEST_ID);
    expect(planets).toHaveLength(2)
  });

  test('É possível remover filtros já feitos anteriormente', () => {
    const columnFilter = screen.getByTestId(COLUMN_FILTER_TEST_ID);
    const valueFIlter = screen.getByTestId(VALUE_FITER_TEST_ID);
    const operator = screen.getByTestId(COMPARISON_FILTER_TEST_ID);
    const filterButton = screen.getByTestId(FILTER_BUTTON_TEST_ID);

    expect(columnFilter).toHaveValue('population');

    act(() => {
      userEvent.type(valueFIlter, '1000');
      userEvent.selectOptions(operator, 'igual a');
      userEvent.click(filterButton);
    });

    const filters = screen.getAllByTestId(FILTER_TEST_ID);
    
    expect(filters).toHaveLength(1);
    expect(screen.getAllByTestId(PLANET_NAME_TEST_ID)).toHaveLength(1);

    const deleteBtn = screen.getByTestId(DELETE_FILTER_TEST_ID);
    act(() => {
      userEvent.click(deleteBtn);
    });

    expect(screen.getAllByTestId(PLANET_NAME_TEST_ID)).toHaveLength(3);
  });

  test('É possivél remover todos os filtros de uma vez', () => {
    const columnFilter = screen.getByTestId(COLUMN_FILTER_TEST_ID);
    const valueFilter = screen.getByTestId(VALUE_FITER_TEST_ID);
    const operator = screen.getByTestId(COMPARISON_FILTER_TEST_ID);
    const filterButton = screen.getByTestId(FILTER_BUTTON_TEST_ID);

    act(() => {
      userEvent.selectOptions(columnFilter, 'orbital_period');
      userEvent.selectOptions(operator, 'menor que');
      userEvent.type(valueFilter, '4000');
      userEvent.click(filterButton);
    });

    expect(screen.getAllByTestId(FILTER_TEST_ID)).toHaveLength(1);
    expect(screen.getAllByTestId(PLANET_NAME_TEST_ID)).toHaveLength(2);

    act(() => {
      userEvent.selectOptions(columnFilter, 'surface_water');
      userEvent.selectOptions(operator, 'igual a');
      userEvent.clear(valueFilter);
      userEvent.type(valueFilter, '1');
      userEvent.click(filterButton);
    });

    expect(screen.getAllByTestId(FILTER_TEST_ID)).toHaveLength(2);
    expect(screen.getAllByTestId(PLANET_NAME_TEST_ID)).toHaveLength(1);

    const removeAllFiltersButton = screen.getByRole('button', {
      name: /remover todas filtragens/i
    });

    act(() => {
      userEvent.click(removeAllFiltersButton);
    });
    
    expect(screen.queryAllByTestId(FILTER_TEST_ID)).toHaveLength(0);
    expect(screen.getAllByTestId(PLANET_NAME_TEST_ID)).toHaveLength(3);
  });

});