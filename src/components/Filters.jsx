import React, { useContext, useState, useEffect } from 'react';
import { PlanetsContext } from '../context/PlanetsContext';
import Sort from './Sort';

function Filters() {
  const INITIAL_OPTIONS = [
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ];
  const {
    filterPlanetsByName,
    filterPlanetsByColumn,
  } = useContext(PlanetsContext);
  const [columnOptions, setColumnOption] = useState(INITIAL_OPTIONS);
  const [filterState, setFilterState] = useState({
    name: '',
    column: columnOptions[0],
    operator: 'maior que',
    value: 0,
  });
  const { name, column, operator, value } = filterState;
  const [filtersDone, setFiltersDone] = useState([]);

  const handleChange = ({ target }) => {
    const { name: targetName, value: targetValue } = target;
    setFilterState((prevState) => ({
      ...prevState,
      [targetName]: targetValue,
    }));
  };

  const handleDeleteFilter = ({ target: { id } }) => {
    const attFiltersDone = filtersDone
      .filter((_filter, index) => Number(index) !== Number(id));
    filterPlanetsByColumn(attFiltersDone, true);
    setFiltersDone(attFiltersDone);
    setColumnOption((prevState) => {
      const { column: filterType } = filtersDone[id];
      const attColumnOptions = [filterType, ...prevState];
      return attColumnOptions;
    });
  };

  const removeAllFilters = () => {
    setFiltersDone([]);
    setColumnOption(INITIAL_OPTIONS);
    filterPlanetsByColumn([]);
  };

  const handleFilter = () => {
    const filterType = {
      column,
      operator,
      value,
    };
    const newFilters = [...filtersDone, filterType];
    setFiltersDone(newFilters);
    const attOptions = columnOptions.filter((option) => option !== column);
    setColumnOption(attOptions);
    filterPlanetsByColumn(newFilters);
  };

  useEffect(() => {
    setFilterState((prevState) => ({
      ...prevState,
      column: columnOptions[0],
    }));
  }, [columnOptions]);

  useEffect(() => {
    filterPlanetsByName(name);
  }, [filterPlanetsByName, name]);

  return (
    <section>
      <form>
        <section>
          <label htmlFor="name-filter">
            <span>Nome do planeta</span>
            <input
              value={ name }
              type="text"
              name="name"
              id="name-filter"
              data-testid="name-filter"
              onChange={ handleChange }
            />
          </label>
        </section>

        <label htmlFor="column-filter">
          <span>Coluna</span>
          <select
            id="column-filter"
            name="column"
            data-testid="column-filter"
            defaultValue={ column }
            onChange={ handleChange }
          >
            {
              columnOptions.map((option, index) => (
                <option key={ index } value={ option }>{option}</option>
              ))
            }
          </select>
        </label>

        <label htmlFor="operator-filter">
          <span>Operador</span>
          <select
            id="operator-filter"
            name="operator"
            data-testid="comparison-filter"
            value={ operator }
            onChange={ handleChange }
          >
            <option value="maior que">maior que</option>
            <option value="menor que">menor que</option>
            <option value="igual a">igual a</option>

          </select>
        </label>

        <label htmlFor="value-filter">
          <span>Valor</span>
          <input
            id="value-filter"
            type="number"
            data-testid="value-filter"
            value={ value }
            name="value"
            onChange={ handleChange }
          />
        </label>

        <button
          type="button"
          data-testid="button-filter"
          onClick={ handleFilter }
        >
          Filtrar
        </button>
      </form>
      <Sort INITIAL_OPTIONS={ INITIAL_OPTIONS } />
      <section>
        {
          filtersDone.map((filter, index) => {
            const {
              column: filterColumn,
              operator: filterOperator,
              value: filterValue,
            } = filter;
            return (
              <div key={ index } data-testid="filter">
                <button
                  onClick={ handleDeleteFilter }
                  type="button"
                  id={ index }
                  data-testid="delete-filter"
                >
                  Deletar
                </button>
                <span>
                  {`${filterColumn} ${filterOperator} ${filterValue}`}
                </span>
              </div>
            );
          })
        }
        <button
          data-testid="button-remove-filters"
          type="button"
          onClick={ removeAllFilters }
        >
          Remover todas filtragens
        </button>
      </section>
    </section>
  );
}

export default Filters;
