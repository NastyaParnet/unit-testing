const tourController = require('../controllers/tourController');
const Tour = require('../models/tourModel');
const { filter } = require('../utils/filtering');

jest.mock('../models/tourModel');
jest.mock('../utils/filtering');

describe('Tour Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('getAllTours', () => {
    it('should return all tours', async () => {
      const mockTours = [{ name: 'Tour 1' }, { name: 'Tour 2' }];
      filter.mockResolvedValue(mockTours);

      await tourController.getAllTours(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: mockTours.length,
        data: { tours: mockTours }
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Error fetching tours');
      filter.mockRejectedValue(error);

      await tourController.getAllTours(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: error
      });
    });
  });

  describe('getTour', () => {
    it('should return a single tour', async () => {
      const mockTour = { name: 'Tour 1' };
      req.params.id = '1';
      Tour.findById.mockResolvedValue(mockTour);

      await tourController.getTour(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { tour: mockTour }
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Error fetching tour');
      req.params.id = '1';
      Tour.findById.mockRejectedValue(error);

      await tourController.getTour(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: error
      });
    });
  });

  describe('createTour', () => {
    it('should create a new tour', async () => {
      const mockTour = { name: 'New Tour' };
      req.body = mockTour;
      Tour.create.mockResolvedValue(mockTour);

      await tourController.createTour(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { tour: mockTour }
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Error creating tour');
      req.body = { name: 'New Tour' };
      Tour.create.mockRejectedValue(error);

      await tourController.createTour(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: error
      });
    });
  });

  describe('updateTour', () => {
    it('should update a tour', async () => {
      const mockTour = { name: 'Updated Tour' };
      req.params.id = '1';
      req.body = mockTour;
      Tour.findByIdAndUpdate.mockResolvedValue(mockTour);

      await tourController.updateTour(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { tour: mockTour }
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Error updating tour');
      req.params.id = '1';
      req.body = { name: 'Updated Tour' };
      Tour.findByIdAndUpdate.mockRejectedValue(error);

      await tourController.updateTour(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: error
      });
    });
  });

  describe('deleteTour', () => {
    it('should delete a tour', async () => {
      req.params.id = '1';
      Tour.findByIdAndDelete.mockResolvedValue(null);

      await tourController.deleteTour(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: null
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Error deleting tour');
      req.params.id = '1';
      Tour.findByIdAndDelete.mockRejectedValue(error);

      await tourController.deleteTour(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: error
      });
    });
  });
});
