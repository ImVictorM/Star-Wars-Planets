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

  const sortPlanets = useCallback((order) => {
    const { column, sort } = order;
    const filteredPlanetsCopy = [...filteredPlanets];
    const POSITIVE_NUMBER = 1;
    const NEGATIVE_NUMBER = -1;
    const NEUTRAL_NUMBER = 0;
    const UNKNOWN_CASE = 'unknown';
    filteredPlanetsCopy.sort((a, b) => {
      if (a[column] === UNKNOWN_CASE && b[column] === UNKNOWN_CASE) {
        return NEUTRAL_NUMBER;
      }
      if (a[column] === UNKNOWN_CASE) {
        return POSITIVE_NUMBER;
      }
      if (b[column] === UNKNOWN_CASE) {
        return NEGATIVE_NUMBER;
      }
      switch (sort) {
      case 'ASC':
        return a[column] - b[column];
      case 'DESC':
        return b[column] - a[column];
      default:
        return undefined;
      }
    });
    setFilteredPlanets(filteredPlanetsCopy);
  }, [filteredPlanets]);

  const contextValue = useMemo(() => ({
    filteredPlanets,
    filterPlanetsByName,
    filterPlanetsByColumn,
    sortPlanets,
  }), [filteredPlanets, filterPlanetsByName, filterPlanetsByColumn, sortPlanets]);

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
