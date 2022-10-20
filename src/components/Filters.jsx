import React, { useContext, useState, useEffect } from 'react';
import { PlanetsContext } from '../context/PlanetsContext';

function Filters() {
  const {
    filterPlanetsByName,
    filterPlanetsByColumn,
  } = useContext(PlanetsContext);
  const [columnOptions, setColumnOption] = useState([
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ]);
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

  const handleFilter = () => {
    filterPlanetsByColumn(column, operator, value);
    const filterType = {
      column,
      operator,
      value,
    };
    setFiltersDone((prevState) => [...prevState, filterType]);
    const attOptions = columnOptions.filter((option) => option !== column);
    setColumnOption(attOptions);
    setFilterState((prevState) => ({
      ...prevState,
      column: attOptions[0],
    }));
  };

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
              columnOptions.map((option) => (
                <option key={ option } value={ option }>{option}</option>
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
      <section>
        {
          filtersDone.map((filter) => {
            const {
              column: filterColumn,
              operator: filterOperator,
              value: filterValue,
            } = filter;
            return (
              <div key={ filterColumn }>
                <span>{`${filterColumn} ${filterOperator} ${filterValue}`}</span>
                <button type="button">Deletar</button>
              </div>
            );
          })
        }
      </section>
    </section>
  );
}

export default Filters;
