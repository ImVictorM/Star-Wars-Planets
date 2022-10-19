import React, { useContext, useState, useEffect } from 'react';
import { PlanetsContext } from '../context/PlanetsContext';

function Filters() {
  const { filterPlanetsByName } = useContext(PlanetsContext);
  const [filterState, setFilterState] = useState({
    name: '',
  });
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFilterState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const { name } = filterState;
    filterPlanetsByName(name);
  }, [filterPlanetsByName, filterState]);
  return (
    <form>
      <label htmlFor="name-filter">
        <input
          type="text"
          name="name"
          id="name-filter"
          data-testid="name-filter"
          onChange={ handleChange }
        />
      </label>
    </form>
  );
}

export default Filters;
