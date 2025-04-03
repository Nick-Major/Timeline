export default function parseCoordinates(input) {
    // Удаляем квадратные скобки, если они есть
    const cleanedInput = input.replace(/[\[\]]/g, '');
    
    // Разбиваем строку по запятой
    const parts = cleanedInput.split(',');
    
    if (parts.length !== 2) {
      throw new Error('Неверный формат координат. Используйте: широта, долгота');
    }
    
    // Удаляем пробелы и преобразуем в числа
    const latitude = parseFloat(parts[0].trim());
    const longitude = parseFloat(parts[1].trim());
    
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Координаты должны быть числами');
    }
    
    if (latitude < -90 || latitude > 90) {
      throw new Error('Широта должна быть между -90 и 90');
    }
    
    if (longitude < -180 || longitude > 180) {
      throw new Error('Долгота должна быть между -180 и 180');
    }
    
    return { latitude, longitude };
  }