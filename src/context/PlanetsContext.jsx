import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import getPlanets from '../helpers/planetsApi';

export const PlanetsContext = createContext();
function Provider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [filteredPlanets, setFilteredPlanets] = useState(planets);

  useEffect(() => {
    const settingPlanets = async () => {
      const receivedPlanets = await getPlanets();
      setPlanets(receivedPlanets);
      setFilteredPlanets(receivedPlanets);
    };
    settingPlanets();
  }, []);

  const filterPlanetsByName = useCallback((name) => {
    const planetsToDisplay = planets.filter((planet) => planet.name.includes(name));
    setFilteredPlanets(planetsToDisplay);
  }, [planets]);

  const contextValue = useMemo(() => ({
    filteredPlanets,
    filterPlanetsByName,
  }), [filteredPlanets, filterPlanetsByName]);

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
