import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { PlanetsContext } from '../context/PlanetsContext';

function Sort({ INITIAL_OPTIONS }) {
  const [order, setOrder] = useState({
    column: INITIAL_OPTIONS[0],
    sort: '',
  });

  const { sortPlanets } = useContext(PlanetsContext);

  const handleChange = ({ target }) => {
    const { name: targetName, value: targetValue } = target;
    setOrder((prevState) => ({
      ...prevState,
      [targetName]: targetValue,
    }));
  };

  const handleSort = () => {
    sortPlanets(order);
  };

  const { column } = order;
  return (
    <form>
      <label htmlFor="sort-column">
        <span>Ordernar</span>
        <select
          name="column"
          id="sort-column"
          data-testid="column-sort"
          onChange={ handleChange }
          value={ column }
        >
          {
            INITIAL_OPTIONS
              .map((option, index) => (
                <option
                  key={ index }
                  value={ option }
                >
                  {option}
                </option>
              ))
          }
        </select>
      </label>

      <label htmlFor="asc-order">
        <span>Ascendente</span>
        <input
          type="radio"
          name="sort"
          id="asc-order"
          value="ASC"
          data-testid="column-sort-input-asc"
          onChange={ handleChange }
        />
      </label>

      <label htmlFor="desc-order">
        <span>Descendente</span>
        <input
          type="radio"
          name="sort"
          id="desc-order"
          value="DESC"
          data-testid="column-sort-input-desc"
          onChange={ handleChange }
        />
      </label>

      <button
        type="button"
        data-testid="column-sort-button"
        onClick={ handleSort }
      >
        Ordenar
      </button>
    </form>
  );
}

Sort.propTypes = {
  INITIAL_OPTIONS: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Sort;
