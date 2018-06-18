const assert = require('assert');
const { create } = require('microstates');

class Pedestrian {
  constructor() {
    this.activity = String;
  }

  timer(trafficLight) {
    let { activity } = this;

    switch (trafficLight) {
      case 'green': return activity.set('walk');
      case 'yellow': return activity.set('run');
      case 'red': return activity.set('stand');
      default:
        return activity.set('wait');
    }
  }
}

class Light {
  
  constructor() {
    this.color = String;
  }
  
  timer() {
    let { color } = this;
    
    switch (color.state) {
      case 'green': return color.set('yellow');
      case 'yellow': return color.set('red');
      case 'red': return color.set('green');
      default:
        return this;
    }    
  }
}

class Intersection {
  constructor() {
    this.pedestrian = Pedestrian;
    this.light = Light; 
  }

  initialize() {
    // when initializing the intersection,
    // make sure that pedestrian gets initializated into 
    // their appropriate state
    return this.pedestrian.timer(this.light.color.state);
  }

  timer() {
    // first tick the light to change color
    let nextLight = this.light.timer();

    // based on result of the light, change the pedestrian
    return nextLight.pedestrian.timer(nextLight.light.color.state);
  }
}

/**
 * Initialization
 */

let green = create(Intersection, { light: { color: 'green' } });
// when initializating with light as green, pedestrian should initialize to walk
assert.equal(green.pedestrian.activity.state, 'walk');

let yellow = create(Intersection, { light: { color: 'yellow' }});
// when initializing with light as yellow, pedestrian should initialize to run
assert.equal(yellow.pedestrian.activity.state, 'run');

let red = create(Intersection, { light: { color: 'red' }});
// when initializing with light as red, pedestrian should initialize to stand 
assert.equal(red.pedestrian.activity.state, 'stand');

/**
 * Timer
 */
let yellowFromGreen = green.timer();
// from green go to yellow and pedestrian should run
assert.equal(yellowFromGreen.light.color.state, 'yellow');
assert.equal(yellowFromGreen.pedestrian.activity.state, 'run');

let redFromYellow = yellow.timer();
// from yellow go to red and pedestrian should stand
assert.equal(redFromYellow.light.color.state, 'red');
assert.equal(redFromYellow.pedestrian.activity.state, 'stand');