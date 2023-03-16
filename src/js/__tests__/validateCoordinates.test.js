import validateCoordinates from "../validateCoordinates";

describe('validateCoordinates function', () => {
  let input;

  beforeEach(() => {
    input = {
      value: '',
      setCustomValidity: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return false for invalid coordinates format', () => {
    input.value = 'qwerty';
    expect(validateCoordinates(input)).toBe(false);
    expect(input.setCustomValidity).toHaveBeenCalledWith('Введите корректные координаты');
  });

  it('should return false for coordinates outside the range', () => {
    input.value = '100, 200';
    expect(validateCoordinates(input)).toBe(false);
    expect(input.setCustomValidity).toHaveBeenCalledWith('Введите корректные координаты');
  });

  it('should return true for valid coordinates', () => {
    input.value = '37.7749, -122.4194';
    expect(validateCoordinates(input)).toBe(true);
    expect(input.setCustomValidity).toHaveBeenCalledWith('');
  });
});
