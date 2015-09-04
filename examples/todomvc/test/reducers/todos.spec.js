import expect from 'expect';
import createReducer from '../../createReducer';

const initialState = [{
  text: 'Use Redux',
  completed: false,
  id: 0
}];

const todos = createReducer(initialState);

describe('todos reducer', () => {
  it('should handle initial state', () => {
    expect(
      todos(undefined, {})
    ).toEqual([{
      text: 'Use Redux',
      completed: false,
      id: 0
    }]);
  });

  it('should handle ADD_TODO', () => {
    expect(
      todos([], {
        type: 'ADD_TODO',
        text: 'Run the tests'
      })
    ).toEqual([{
      text: 'Run the tests',
      completed: false,
      id: 0
    }]);

    expect(
      todos([{
        text: 'Use Redux',
        completed: false,
        id: 0
      }], {
        type: 'ADD_TODO',
        text: 'Run the tests'
      })
    ).toEqual([{
      text: 'Use Redux',
      completed: false,
      id: 0
    }, {
      text: 'Run the tests',
      completed: false,
      id: 1
    }]);

    expect(
      todos([{
        text: 'Use Redux',
        completed: false,
        id: 0
      }, {
        text: 'Run the tests',
        completed: false,
        id: 1
      }], {
        type: 'ADD_TODO',
        text: 'Fix the tests'
      })
    ).toEqual([{
      text: 'Use Redux',
      completed: false,
      id: 0
    }, {
      text: 'Run the tests',
      completed: false,
      id: 1
    }, {
      text: 'Fix the tests',
      completed: false,
      id: 2
    }]);
  });

  it('should handle DELETE_TODO', () => {
    expect(
      todos([{
        text: 'Run the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }], {
        type: 'DELETE_TODO',
        id: 1
      })
    ).toEqual([{
      text: 'Use Redux',
      completed: false,
      id: 0
    }]);
  });

  it('should handle EDIT_TODO', () => {
    expect(
      todos([{
        text: 'Run the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }], {
        type: 'EDIT_TODO',
        text: 'Fix the tests',
        id: 1
      })
    ).toEqual([{
      text: 'Fix the tests',
      completed: false,
      id: 1
    }, {
      text: 'Use Redux',
      completed: false,
      id: 0
    }]);
  });

  it('should handle COMPLETE_TODO', () => {
    expect(
      todos([{
        text: 'Run the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }], {
        type: 'COMPLETE_TODO',
        id: 1
      })
    ).toEqual([{
      text: 'Run the tests',
      completed: true,
      id: 1
    }, {
      text: 'Use Redux',
      completed: false,
      id: 0
    }]);
  });

  it('should handle COMPLETE_ALL', () => {
    expect(
      todos([{
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }], {
        type: 'COMPLETE_ALL'
      })
    ).toEqual([{
      text: 'Run the tests',
      completed: true,
      id: 1
    }, {
      text: 'Use Redux',
      completed: true,
      id: 0
    }]);

    // Unmark if all todos are currently completed
    expect(
      todos([{
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: true,
        id: 0
      }], {
        type: 'COMPLETE_ALL'
      })
    ).toEqual([{
      text: 'Run the tests',
      completed: false,
      id: 1
    }, {
      text: 'Use Redux',
      completed: false,
      id: 0
    }]);
  });

  it('should handle CLEAR_COMPLETED', () => {
    expect(
      todos([{
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }], {
        type: 'CLEAR_COMPLETED'
      })
    ).toEqual([{
      text: 'Use Redux',
      completed: false,
      id: 0
    }]);
  });

  it('should not generate duplicate ids after CLEAR_COMPLETED', () => {
    expect(
      [{
        type: 'COMPLETE_TODO',
        id: 0
      }, {
        type: 'CLEAR_COMPLETED'
      }, {
        type: 'ADD_TODO',
        text: 'Write more tests'
      }].reduce(todos, [{
        id: 0,
        completed: false,
        text: 'Use Redux'
      }, {
        id: 1,
        completed: false,
        text: 'Write tests'
      }])
    ).toEqual([{
      text: 'Write tests',
      completed: false,
      id: 1
    }, {
      text: 'Write more tests',
      completed: false,
      id: 2
    }]);
  });
});
