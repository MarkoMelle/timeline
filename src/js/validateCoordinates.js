export default function validateCoordinates(coordinatesInput) {
  const coordinatesRegex = /^([-]?\d+(?:\.\d+)?),\s*([-]?\d+(?:\.\d+)?)$/;
  const coordinates = coordinatesInput.value.trim();
  if (!coordinatesRegex.test(coordinates)) {
    coordinatesInput.setCustomValidity('Введите корректные координаты');
    return false;
  }
  const [latitude, longitude] = coordinates.match(coordinatesRegex).slice(1);
  if (
    latitude < -90
      || latitude > 90
      || longitude < -180
      || longitude > 180
  ) {
    coordinatesInput.setCustomValidity('Введите корректные координаты');
    return false;
  }
  coordinatesInput.setCustomValidity('');
  return true;
}
