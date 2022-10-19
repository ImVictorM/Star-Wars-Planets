import React, { useContext, useState, useEffect } from 'react';
import { PlanetsContext } from '../context/PlanetsContext';

function Filters() {
  const {
    filterPlanetsByName,
    filterPlanetsByColumn,
  } = useContext(PlanetsContext);

  const [filterState, setFilterState] = useState({
    name: '',
    column: 'population',
    operator: 'maior que',
    value: 0,
  });
  const { name, column, operator, value } = filterState;
  const [filtersMade, setFiltersMade] = useState([]);

  const handleChange = ({ target }) => {
    const { name: targetName, value: targetValue } = target;
    setFilterState((prevState) => ({
      ...prevState,
      [targetName]: targetValue,
    }));
  };

  const handleFilter = () => {
    filterPlanetsByColumn(column, operator, value);
    const filterType = `${column} ${operator} ${value}`;
    setFiltersMade((prevState) => [...prevState, filterType]);
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
            value={ column }
            onChange={ handleChange }
          >
            <option value="population">population</option>
            <option value="orbital_period">orbital_period</option>
            <option value="diameter">diameter</option>
            <option value="rotation_period">rotation_period</option>
            <option value="surface_water">surface_water</option>
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
          filtersMade.map((filter) => (
            <div key={ filter }>
              <span>{filter}</span>
              <button type="button">Deletar</button>
            </div>
          ))
        }
      </section>
    </section>
  );
}

export default Filters;
