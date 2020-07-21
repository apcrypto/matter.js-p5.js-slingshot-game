var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Mouse = Matter.Mouse;
var Constraint = Matter.Constraint;
var MouseConstraint = Matter.MouseConstraint;
var ball;
var boxes = [];
var slingshot;
var ballImg;
var boxImg;
var birdImg;
var x, y;

function preload() {
  ballImg = loadImage("./assets/ball.png");
  boxImg = loadImage("./assets/box.png");
  slingImg = loadImage("./assets/slingshot.png");
  birdImg = loadImage("./assets/bird.png");
}

function setup() {
  pixelDensity(1);
  canvas = createCanvas(600, 400);
  engine = Engine.create();
  world = engine.world;
  x = width;
  y = height / 5;

  ground = new Ground(width / 2, height - 10, width, 20);
  for (var i = 0; i < 4; i++) {
    boxes[i] = new Box(500, 300 - i * 75, 60, 60, { friction: 1 });
  }
  ball = new Ball(150, 300, 20);
  slingshot = new SlingShot(150, 290, ball.body);

  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
    },
  };
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(world, mouseConstraint);

  // run the engine
  Engine.run(engine);
}

function mouseReleased() {
  setTimeout(() => {
    slingshot.fly();
  }, 50);
}

function draw() {
  background(118, 199, 232);
  // yellow circle for sun
  push();
  noStroke();
  fill(255, 255, 0);
  circle(220, 70, 40, 40);
  pop();
  // clouds
  push();
  noStroke();
  circle(400, 100, 30, 30);
  circle(480, 100, 30, 30);
  circle(440, 70, 30, 30);
  rect(400, 90, 80, 40);
  pop();

  push();
  noStroke();
  circle(100, 100, 30, 30);
  circle(180, 100, 30, 30);
  circle(140, 70, 30, 30);
  rect(100, 90, 80, 40);
  pop();

  Matter.Engine.update(engine);
  ground.show();
  for (let box of boxes) {
    box.show();
  }

  image(slingImg, 140, 240, 80, 180);

  slingshot.show();
  ball.show();

  // Draw bird
  image(birdImg, x, y, 40, 40);

  // Jiggling randomly on the vertical axis
  y = y + random(-1, 1);
  // Moving left at a constant speed
  x = x - 1;

  // Reset to the bottom
  if (x < 0) {
    x = width;
  }
}

class Ground {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.body = Matter.Bodies.rectangle(x, y, w, h);
    this.body.isStatic = true;
    Matter.World.add(world, this.body);
  }
  show() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    noStroke();
    translate(pos.x, pos.y);
    fill(210, 105, 30);
    rectMode(CENTER);
    rotate(angle);
    rect(0, 0, this.w, this.h);
    pop();
  }
}

class Box {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.body = Matter.Bodies.rectangle(x, y, w, h);
    Matter.World.add(world, this.body);
  }
  show() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    fill(255);
    rectMode(CENTER);
    imageMode(CENTER);
    rotate(angle);
    image(boxImg, 0, 0, this.w, this.h);
    pop();
  }
}

class Ball {
  constructor(x, y, r) {
    this.r = r;
    this.body = Matter.Bodies.circle(x, y, r);
    Matter.World.add(world, this.body);
  }
  show() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(ballImg, 0, 0, this.r * 2, this.r * 2);
    pop();
  }
}

class SlingShot {
  constructor(x, y, body) {
    var options = {
      pointA: { x: x, y: y },
      bodyB: body,
      stiffness: 0.02,
      length: 40,
    };
    this.sling = Constraint.create(options);
    World.add(world, this.sling);
  }

  fly() {
    this.sling.bodyB = null;
  }

  show() {
    if (this.sling.bodyB) {
      stroke(1);
      var posA = this.sling.pointA;
      var posB = this.sling.bodyB.position;
      line(posA.x, posA.y, posB.x, posB.y);
    }
  }
}
