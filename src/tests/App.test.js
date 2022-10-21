import React from 'react';
import App from '../App';
import { screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
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

describe('Testa bad request', () => {
  test('Imprime erro no console quando a api não retorna o valor esperado', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error));
    const logSpy = jest.spyOn(console, 'log');
    renderWithProvider(<App />);
    await waitFor(() => expect(global.fetch).rejects);
    expect(logSpy).toHaveBeenCalledWith(new Error);
  });
});

