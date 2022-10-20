import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import getPlanets from '../helpers/planetsApi';

export const PlanetsContext = createContext();
function Provider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [filteredPlanets, setFilteredPlanets] = useState([]);

  useEffect(() => {
    const settingPlanets = async () => {
      const receivedPlanets = await getPlanets();
      setPlanets(receivedPlanets);
      setFilteredPlanets(receivedPlanets);
    };
    settingPlanets();
  }, []);

  const filterPlanetsByName = useCallback((name) => {
    const filteredPlanetsByName = planets.filter((planet) => planet.name.includes(name));
    setFilteredPlanets(filteredPlanetsByName);
  }, [planets]);

  const filterPlanetsByColumn = useCallback((filtersDone, remove = false) => {
    console.log(filtersDone);
    if (filtersDone.length > 0) {
      const planetsToFilter = remove ? planets : filteredPlanets;
      filtersDone.forEach((filter) => {
        const { column, operator, value } = filter;
        const filteredPlanetsByColumn = planetsToFilter.filter((planet) => {
          const columnValueToCompare = Number(planet[column]);
          const valueToCompare = Number(value);
          switch (operator) {
          case 'maior que':
            return columnValueToCompare > valueToCompare;
          case 'menor que':
            return columnValueToCompare < valueToCompare;
          default:
            return columnValueToCompare === valueToCompare;
          }
        });
        setFilteredPlanets(filteredPlanetsByColumn);
      });
    } else {
      setFilteredPlanets(planets);
    }
  }, [planets, filteredPlanets]);

  const contextValue = useMemo(() => ({
    filteredPlanets,
    filterPlanetsByName,
    filterPlanetsByColumn,
  }), [filteredPlanets, filterPlanetsByName, filterPlanetsByColumn]);

  return (
    <PlanetsContext.Provider value={ contextValue }>
      {children}
    </PlanetsContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
