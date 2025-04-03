import parseCoordinates from "../js/parseCoordinates";

describe('parseCoordinates', () => {
    test('корректно парсит валидные координаты', () => {
      // Стандартный формат
      expect(parseCoordinates("51.50851, -0.12572")).toEqual({
        latitude: 51.50851,
        longitude: -0.12572
      });
  
      // Без пробела
      expect(parseCoordinates("51.50851,-0.12572")).toEqual({
        latitude: 51.50851,
        longitude: -0.12572
      });
  
      // С квадратными скобками
      expect(parseCoordinates("[51.50851, -0.12572]")).toEqual({
        latitude: 51.50851,
        longitude: -0.12572
      });
  
      // Граничные значения
      expect(parseCoordinates("90, 180")).toEqual({
        latitude: 90,
        longitude: 180
      });
    });
  
    test('выбрасывает ошибку при неверном формате', () => {
      // Не хватает одной координаты
      expect(() => parseCoordinates("51.50851")).toThrow('Неверный формат координат');
  
      // Слишком много координат
      expect(() => parseCoordinates("1,2,3")).toThrow('Неверный формат координат');
  
      // Неправильный разделитель
      expect(() => parseCoordinates("51.50851; -0.12572")).toThrow('Неверный формат координат');
    });
  
    test('выбрасывает ошибку при нечисловых координатах', () => {
      expect(() => parseCoordinates("abc, def")).toThrow('Координаты должны быть числами');
    });
  
    test('выбрасывает ошибку при недопустимых значениях', () => {
      // Широта вне диапазона
      expect(() => parseCoordinates("91, 0")).toThrow('Широта должна быть между -90 и 90');
      expect(() => parseCoordinates("-91, 0")).toThrow('Широта должна быть между -90 и 90');
  
      // Долгота вне диапазона
      expect(() => parseCoordinates("0, 181")).toThrow('Долгота должна быть между -180 и 180');
      expect(() => parseCoordinates("0, -181")).toThrow('Долгота должна быть между -180 и 180');
    });
  
    test('корректно обрабатывает пробелы', () => {
      expect(parseCoordinates("  51.50851  ,  -0.12572  ")).toEqual({
        latitude: 51.50851,
        longitude: -0.12572
      });
    });
  });