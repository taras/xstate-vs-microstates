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
    }
    
    return this;
  }
}

class Intersection {
  constructor() {
    this.pedestrian = Pedestrian;
    this.light = Light; 
  }

  initialize() {
    return this.pedestrian.timer(this.light.color.state);
  }

  timer() {
    let nextLight = this.light.timer();

    return nextLight.pedestrian.timer(nextLight.light.color.state);
  }
}

/**
 * Initialization
 */
let green = create(Intersection, { light: { color: 'green' } });

assert.equal(green.pedestrian.activity.state, 'walk');

let yellow = create(Intersection, { light: { color: 'yellow' }});

assert.equal(yellow.pedestrian.activity.state, 'run');

let red = create(Intersection, { light: { color: 'red' }});

assert.equal(red.pedestrian.activity.state, 'stand');

/**
 * Timer
 */
let yellowFromGreen = green.timer();
assert.equal(yellowFromGreen.light.color.state, 'yellow');
assert.equal(yellowFromGreen.pedestrian.activity.state, 'run');

let redFromYellow = yellow.timer();
assert.equal(redFromYellow.light.color.state, 'red');
assert.equal(redFromYellow.pedestrian.activity.state, 'stand');