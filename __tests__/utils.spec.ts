import getFormattedDay from '../utils/utils';

describe('Date Formatter', () => {
  test('should format date to DD-MM correctly', () => {
    const formatted = getFormattedDay();
    expect(formatted).toMatch(/^\d{2}-\d{2}$/);
  });
});
