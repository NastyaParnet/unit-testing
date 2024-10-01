const { filter } = require('../utils/filtering');

describe('filter function', () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = {
      find: jest.fn().mockResolvedValue('filtered results')
    };
  });

  it('should filter out excluded fields', async () => {
    const queryString = {
      page: 1,
      sort: 'asc',
      limit: 10,
      fields: 'name',
      name: 'test'
    };
    const result = await filter(mockQuery, queryString);

    expect(mockQuery.find).toHaveBeenCalledWith({ name: 'test' });
    expect(result).toBe('filtered results');
  });

  it('should handle comparison operators', async () => {
    const queryString = { price: { gte: 10, lte: 100 } };
    const result = await filter(mockQuery, queryString);

    expect(mockQuery.find).toHaveBeenCalledWith({
      price: { $gte: 10, $lte: 100 }
    });
    expect(result).toBe('filtered results');
  });

  it('should handle multiple fields', async () => {
    const queryString = { name: 'test', price: { gte: 10, lte: 100 } };
    const result = await filter(mockQuery, queryString);

    expect(mockQuery.find).toHaveBeenCalledWith({
      name: 'test',
      price: { $gte: 10, $lte: 100 }
    });
    expect(result).toBe('filtered results');
  });

  it('should return empty object if only excluded fields are present', async () => {
    const queryString = { page: 1, sort: 'asc', limit: 10, fields: 'name' };
    const result = await filter(mockQuery, queryString);

    expect(mockQuery.find).toHaveBeenCalledWith({});
    expect(result).toBe('filtered results');
  });
});
