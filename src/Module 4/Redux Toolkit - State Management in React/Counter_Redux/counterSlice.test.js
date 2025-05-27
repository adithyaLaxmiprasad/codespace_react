import counterReducer, { 
  increment, 
  decrement, 
  incrementByAmount, 
  resetCounter,
  COUNTER_MAX_VALUE,
  COUNTER_MIN_VALUE
} from './counterSlice';

describe('counter reducer', () => {
  const initialState = {
    value: 0,
    error: null,
    isLoading: false
  };

  test('should return the initial state', () => {
    expect(counterReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should handle increment', () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(1);
    expect(actual.error).toBeNull();
  });

  test('should handle decrement', () => {
    const actual = counterReducer(initialState, decrement());
    expect(actual.value).toEqual(-1);
    expect(actual.error).toBeNull();
  });

  test('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(5));
    expect(actual.value).toEqual(5);
    expect(actual.error).toBeNull();
  });

  test('should handle resetCounter', () => {
    const actual = counterReducer({ value: 10, error: null, isLoading: false }, resetCounter());
    expect(actual.value).toEqual(0);
    expect(actual.error).toBeNull();
  });

  test('should reject invalid increment amounts', () => {
    const actual = counterReducer(initialState, incrementByAmount('not-a-number'));
    expect(actual.value).toEqual(0);
    expect(actual.error).not.toBeNull();
  });

  test('should prevent exceeding maximum value', () => {
    const state = { value: COUNTER_MAX_VALUE, error: null, isLoading: false };
    const actual = counterReducer(state, increment());
    expect(actual.value).toEqual(COUNTER_MAX_VALUE);
    expect(actual.error).not.toBeNull();
  });

  test('should prevent going below minimum value', () => {
    const state = { value: COUNTER_MIN_VALUE, error: null, isLoading: false };
    const actual = counterReducer(state, decrement());
    expect(actual.value).toEqual(COUNTER_MIN_VALUE);
    expect(actual.error).not.toBeNull();
  });
});