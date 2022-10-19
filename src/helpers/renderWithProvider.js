import React from 'react';
import { render } from '@testing-library/react';
import Provider from '../context/PlanetsContext';

function renderWithProvider(component) {
  return {
    ...render(
      <Provider>
        {component}
      </Provider>,
    ),
  };
}

export default renderWithProvider;
