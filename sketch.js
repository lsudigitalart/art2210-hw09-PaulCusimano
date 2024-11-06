let sun;
let planets = [];
let startRace = false;
let frameCounter = 0;
const MIN_SPEED = 0.015;
const MAX_SPEED = 0.025;
const SPEED_CHANGE_INTERVAL = 10; 
const RUBBERBAND_STRENGTH = 0.0005;
let stars = [];
let raceOver = false;
const LAPS_TO_WIN = 3;

function setup() {
  createCanvas(600, 600);

  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }

  let baseSpeed = 0.02;
  
  planets.push(createPlanet(100, baseSpeed, 20, 'red'));
  planets.push(createPlanet(150, baseSpeed, 25, 'blue')); 
  planets.push(createPlanet(200, baseSpeed, 30, 'green'));
  planets.push(createPlanet(250, baseSpeed, 35, 'yellow'));
}

function drawBackground() {
  // makes a gradient
  let radius = max(width*2, height*2);
  for (let r = radius; r > 0; r -= 2) {
    let inter = map(r, radius, 0, 0, 1);
    let c = lerpColor(
      color(25, 25, 50),
      color(75, 50, 150)  
    , inter);
    noStroke();
    fill(c);
    ellipse(width/2, height/2, r, r);
  }

  // stars
  fill(255);
  noStroke();
  for (let star of stars) {
    ellipse(star.x, star.y, star.size);
  }
}

function draw() {
  drawBackground();
  // sun
  fill(255, 204, 0);
  noStroke();
  ellipse(width/2, height/2, 50);

  // orbit lines
  stroke(150);
  noFill();
  for (let planet of planets) {
    ellipse(width / 2, height / 2, planet.distance * 2, planet.distance * 2);
  }

  if (startRace && !raceOver) {
    frameCounter++;
    
    if (frameCounter % SPEED_CHANGE_INTERVAL === 0) {
      randomizeSpeed();
    }
    
    balanceSpeeds();
  }

  for (let planet of planets) {
    if (startRace && !raceOver) {
      movePlanet(planet);
    }
    displayPlanet(planet);
  }

  // look for winner
  let winner = planets.find(p => p.orbits >= LAPS_TO_WIN);
  if (winner && !raceOver) {
    raceOver = true;
    startRace = false;
  }

  // show orbit counts and status
  textSize(16);
  let maxProgress = Math.max(...planets.map(p => p.angle + TWO_PI * p.orbits));
  for (let i = 0; i < planets.length; i++) {
    fill(planets[i].color);
    let totalProgress = planets[i].angle + TWO_PI * planets[i].orbits;
    let leaderText = totalProgress === maxProgress ? " (leader)" : "";
    text(`Planet ${i + 1}: ${planets[i].orbits} orbits${leaderText}`, 10, 20 + i * 20);
  }

  // winner message
  if (raceOver) {
    textSize(32);
    fill(255);
    textAlign(CENTER);
    text(`Planet ${planets.indexOf(winner) + 1} Wins!`, width/2, height/2);
    textSize(16);
    text('Press ENTER to restart', width/2, height/2 + 30);
    textAlign(LEFT);
  }
}

function randomizeSpeed() {
  for (let planet of planets) {
    planet.speed += random(-0.005, 0.005);
    planet.speed = constrain(planet.speed, MIN_SPEED, MAX_SPEED);
  }
}

function balanceSpeeds() {
  let maxPos = Math.max(...planets.map(p => p.angle + TWO_PI * p.orbits));
  
  for (let planet of planets) {
    let pos = planet.angle + TWO_PI * planet.orbits;
    planet.speed += (maxPos - pos) * RUBBERBAND_STRENGTH;
    planet.speed = constrain(planet.speed, MIN_SPEED, MAX_SPEED);
  }
}

function createPlanet(distance, speed, size, color) {
  return {
    distance,
    angle: -PI / 2,
    speed,
    size,
    color,
    orbits: 0 
  };
}

function movePlanet(planet) {
  planet.angle += planet.speed;
  if (planet.angle >= TWO_PI - PI / 2) {
    planet.angle = -PI / 2;
    planet.orbits++; 
  }
}

function displayPlanet(planet) {
  let x = width / 2 + cos(planet.angle) * planet.distance;
  let y = height / 2 + sin(planet.angle) * planet.distance;
  fill(planet.color);
  noStroke();
  ellipse(x, y, planet.size);
}

function keyPressed() {
  if (keyCode === ENTER && !raceOver) {
    startRace = true;
  }
  if (keyCode === ENTER && raceOver) {
    // Reset game
    raceOver = false;
    startRace = false;
    frameCounter = 0;
    for (let planet of planets) {
      planet.orbits = 0;
      planet.angle = -PI / 2;
      planet.speed = 0.02; // Reset to base speed
    }
  }
  if (!raceOver) {
    if (key === '1') {
      planets[0].speed += 0.01;
    } else if (key === '2') {
      planets[1].speed += 0.01;
    } else if (key === '3') {
      planets[2].speed += 0.01;
    } else if (key === '4') {
      planets[3].speed += 0.01;
    }
  }
}