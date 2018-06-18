const assert = require('assert');

const { Machine } = require('xstate');

const pedestrianStates = {
  initial: 'walk',
  states: {
    walk: {
      on: {
        PED_TIMER: 'wait'
      }
    },
    wait: {
      on: {
        PED_TIMER: 'stop'
      }
    },
    stop: {}
  }
};

const lightMachine = Machine({
  key: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow'
      }
    },
    yellow: {
      on: {
        TIMER: 'red'
      }
    },
    red: {
      on: {
        TIMER: 'green'
      },
      ...pedestrianStates
    }
  }
});

const currentState = 'yellow';

assert.deepEqual(lightMachine.transition(currentState, 'TIMER').value, { red: 'walk' });

let waitState = lightMachine.transition({ red: 'walk' }, 'PED_TIMER').value

assert.deepEqual(waitState, { red: 'wait' });

assert.deepEqual(lightMachine.transition(waitState, 'PED_TIMER').value, { red: 'stop' });

assert.equal(lightMachine.transition({ red: 'stop' }, 'TIMER').value, 'green')