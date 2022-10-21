const STANDARD_GRAVITY = '1 standard';
const fetchMockResults = {
  results: [
    {
      name: 'Tatooine',
      rotation_period: '23',
      orbital_period: '304',
      diameter: 'unknown',
      climate: 'arid',
      gravity: STANDARD_GRAVITY,
      terrain: 'desert',
      surface_water: '1',
      population: '200000',
      residents: ['this should be deleted'],
      films: [
        'https://swapi.dev/api/films/6/',
      ],
      created: '2014-12-09T13:50:49.641000Z',
      edited: '2014-12-20T20:58:18.411000Z',
      url: 'https://swapi.dev/api/planets/1/',
    },
    {
      name: 'Alderaan',
      rotation_period: '24',
      orbital_period: '364',
      diameter: '12500',
      climate: 'temperate',
      gravity: STANDARD_GRAVITY,
      terrain: 'grasslands, mountains',
      residents: ['this one too'],
      surface_water: '40',
      population: '2000000000',
      films: [
        'https://swapi.dev/api/films/1/',
        'https://swapi.dev/api/films/6/',
      ],
      created: '2014-12-10T11:35:48.479000Z',
      edited: '2014-12-20T20:58:18.420000Z',
      url: 'https://swapi.dev/api/planets/2/',
    },
    {
      name: 'Yavin IV',
      rotation_period: '24',
      orbital_period: '4818',
      diameter: 'unknown',
      climate: 'temperate, tropical',
      residents: ['and this'],
      gravity: STANDARD_GRAVITY,
      terrain: 'jungle, rainforests',
      surface_water: '8',
      population: '1000',
      films: [
        'https://swapi.dev/api/films/1/',
      ],
      created: '2014-12-10T11:37:19.144000Z',
      edited: '2014-12-20T20:58:18.421000Z',
      url: 'https://swapi.dev/api/planets/3/',
    },
  ],
};

export default fetchMockResults;
