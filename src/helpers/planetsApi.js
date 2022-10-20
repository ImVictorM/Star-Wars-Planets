async function getPlanets() {
  try {
    const ENDPOINT = 'https://swapi.dev/api/planets';
    const response = await fetch(ENDPOINT);
    const { results } = await response.json();
    results.forEach((planet) => delete planet.residents);
    return results;
  } catch (error) {
    console.log(error);
  }
}

export default getPlanets;
