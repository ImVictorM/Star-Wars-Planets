async function getPlanets() {
  const ENDPOINT = 'https://swapi.dev/api/planets';
  const response = await fetch(ENDPOINT);
  const { results } = await response.json();
  results.forEach((planet) => delete planet.residents);
  return results;
}

export default getPlanets;
