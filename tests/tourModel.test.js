const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const dbHandler = require('./dbHandler');

describe('Tour Model Test', () => {
  const now = new Date('4 Oct 2023');
  function mockNow() {
    global.Date = jest.fn().mockImplementation(() => now);
    global.Date.now = jest.fn().mockReturnValue(now.valueOf());
  }

  beforeAll(async () => {
    mockNow();
    await dbHandler.connect();
  });
  beforeEach(async () => {
    await Tour.deleteMany();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.disconnect();
  });

  it('create & save tour successfully', async () => {
    const validTour = new Tour({
      name: 'The Forest Hiker',
      duration: 5,
      maxGroupSize: 25,
      difficulty: 'medium',
      ratingsAverage: 4.7,
      ratingsQuantity: 37,
      price: 497,
      summary: 'Breathtaking hike through the Canadian Banff National Park',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      startDates: ['2021-06-19', '2021-07-20', '2021-08-18']
    });
    const savedTour = await validTour.save();
    expect(savedTour._id).toBeDefined();
    expect(savedTour.name).toBe(validTour.name);
    expect(savedTour.duration).toBe(validTour.duration);
    expect(savedTour.maxGroupSize).toBe(validTour.maxGroupSize);
    expect(savedTour.difficulty).toBe(validTour.difficulty);
    expect(savedTour.ratingsAverage).toBe(validTour.ratingsAverage);
    expect(savedTour.ratingsQuantity).toBe(validTour.ratingsQuantity);
    expect(savedTour.price).toBe(validTour.price);
    expect(savedTour.summary).toBe(validTour.summary);
    expect(savedTour.description).toBe(validTour.description);
    expect(savedTour.startDates).toEqual(
      expect.arrayContaining(validTour.startDates)
    );
  });

  it('insert tour successfully, but the field does not defined in schema should be undefined', async () => {
    const tourWithInvalidField = new Tour({
      name: 'The Sea Explorer',
      duration: 7,
      maxGroupSize: 15,
      difficulty: 'easy',
      ratingsAverage: 4.8,
      ratingsQuantity: 23,
      price: 997,
      summary: 'Exploring the jaw-dropping US east coast by foot and by boat',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      startDates: ['2021-06-05', '2021-07-10', '2021-08-15'],
      invalidField: 'This field is not defined in schema'
    });
    const savedTourWithInvalidField = await tourWithInvalidField.save();
    expect(savedTourWithInvalidField._id).toBeDefined();
    expect(savedTourWithInvalidField.invalidField).toBeUndefined();
  });

  it('create tour without required field should fail', async () => {
    const tourWithoutRequiredField = new Tour({ name: 'The Snow Adventurer' });
    let err;
    try {
      const savedTourWithoutRequiredField = await tourWithoutRequiredField.save();
      err = savedTourWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.difficulty).toBeDefined();
    expect(err.errors.price).toBeDefined();
  });

  it('create tour with invalid difficulty should fail', async () => {
    const tourWithInvalidDifficulty = new Tour({
      name: 'The Desert Explorer',
      duration: 3,
      maxGroupSize: 10,
      difficulty: 'extreme',
      ratingsAverage: 4.5,
      ratingsQuantity: 15,
      price: 299,
      summary: 'A thrilling adventure through the Sahara Desert',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      startDates: ['2021-06-01', '2021-07-01', '2021-08-01']
    });
    let err;
    try {
      const savedTourWithInvalidDifficulty = await tourWithInvalidDifficulty.save();
      err = savedTourWithInvalidDifficulty;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.difficulty).toBeDefined();
  });

  it('create tour with discount price greater than price should fail', async () => {
    const tourWithInvalidDiscount = new Tour({
      name: 'The Mountain Climber',
      duration: 10,
      maxGroupSize: 20,
      difficulty: 'difficult',
      ratingsAverage: 4.9,
      ratingsQuantity: 50,
      price: 1997,
      priceDiscount: 2000,
      summary: 'An exhilarating climb up the Rocky Mountains',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      startDates: ['2021-06-15', '2021-07-15', '2021-08-15']
    });
    let err;
    try {
      const savedTourWithInvalidDiscount = await tourWithInvalidDiscount.save();
      err = savedTourWithInvalidDiscount;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.priceDiscount).toBeDefined();
  });
});
