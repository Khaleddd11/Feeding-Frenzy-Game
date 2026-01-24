/* ================= CONFIG ================= */
const CONFIG = {
  heroNames: ["Baby Shahd", "Hunter Shahd", "Apex Shahd", "Queen Shahd"],
  sharkSpawnInterval: 400,
  maxSharks: 4,
  maxEnemies: 30,        // قللت العدد عشان الشاشة متبقاش زحمة
  spawnEveryFrames: 20   // قللت السرعة عشان تبقى متوازنة
};

/* ================= ASSETS ================= */
const ASSETS = {
  heroClosed: [
    "assets/characters/hero1_left_closed.png",
    "assets/characters/hero2_left_closed.png",
    "assets/characters/hero3_left_closed.png",
    "assets/characters/hero4_left_closed.png"
  ],
  heroOpen: [
    "assets/characters/hero1_left_open.png",
    "assets/characters/hero2_left_open.png",
    "assets/characters/hero3_left_open.png",
    "assets/characters/hero4_left_open.png"
  ],
  prey: [
    { file: "assets/characters/tiny-fry_left_closed.png", name: "Hamdy", value: 10, speed: 2, scale: 0.6 },
    { file: "assets/characters/swift-minnow_left_closed.png", name: "Khaled", value: 20, speed: 3, scale: 0.8 },
    { file: "assets/characters/spotted-reef_left_closed.png", name: "Salma", value: 35, speed: 4, scale: 1 },
    { file: "assets/characters/apex_left_closed.png", name: "Ahmed", value: 100, speed: 5, scale: 1.3 },
    { file: "assets/characters/shark.png", name: "SHARK", value: 0, speed: 2, scale: 3.0 }
  ],
  bomb: "assets/characters/bomb.png",
  boom: "assets/characters/boom.png"
};

/* ================= STORY ================= */
const STORY = [
  { title: "The Awakening", text: "A tiny fish named Shahd is born.", img: ASSETS.heroClosed[0] },
  { title: "First Hunt", text: "Eat Hamdy to grow.", img: ASSETS.prey[0].file },
  { title: "Danger", text: "Bigger fish rule the sea.", img: ASSETS.prey[2].file },
  { title: "Goal", text: "Become the Queen of the Ocean.", img: ASSETS.heroClosed[3] }
];

let slide = 0;

/* ================= CANVAS ================= */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

let mouse = { x: innerWidth / 2, y: innerHeight / 2 };

/* ================= GAME STATE ================= */
let gameState = {
  running: false,
  score: 0,
  level: 0,
  hero: null,
  enemies: [],
  bombs: [],
  frame: 0
};

/* ================= FISH CLASS ================= */
class Fish {
  constructor(type, x, y, dir) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.eating = false;
    this.update();
  }

  update() {
    if (this.type === "hero") {
      this.img = new Image();
      this.img.src = this.eating ? ASSETS.heroOpen[gameState.level] : ASSETS.heroClosed[gameState.level];
      this.w = 60 + gameState.level * 30;
      this.h = 40 + gameState.level * 20;
    } else {
      const d = ASSETS.prey[this.type];
      this.img = new Image();
      this.img.src = d.file;
      this.speed = d.speed;
      this.scale = d.scale;
      this.w = 60 * this.scale;
      this.h = 40 * this.scale;
    }
  }

  move() {
    if (this.type === "hero") {
      this.x += (mouse.x - this.x) * 0.08;
      this.y += (mouse.y - this.y) * 0.08;
      this.dir = mouse.x > this.x;
    } else {
      this.x += this.dir ? this.speed : -this.speed;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.dir ? -1 : 1, 1);
    ctx.drawImage(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }

  openMouth() {
    if (this.type === "hero") {
      this.eating = true;
      this.update();
      setTimeout(() => {
        this.eating = false;
        this.update();
      }, 250);
    }
  }
}

/* ================= BOMB CLASS ================= */
class Bomb {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -80;
    this.speed = 3;
    this.img = new Image();
    this.img.src = ASSETS.bomb;
    this.exploded = false;
    this.radius = 80;
  }

  move() {
    this.y += this.speed;
  }

  draw() {
    ctx.drawImage(this.img, this.x - 30, this.y - 30, 60, 60);
  }

  explode() {
    if (this.exploded) return;
    this.exploded = true;
    this.img.src = ASSETS.boom;
    setTimeout(() => {
      this.y = canvas.height + 200;
    }, 200);
  }
}

/* ================= GAME FUNCTIONS ================= */
function startGame() {
  gameState.running = true;
  gameState.score = 0;
  gameState.level = 0;
  gameState.enemies = [];
  gameState.bombs = [];
  gameState.frame = 0;

  gameState.hero = new Fish("hero", canvas.width / 2, canvas.height / 2, true);

  updateUI();
  loop();
}

function spawnEnemy() {
  if (gameState.enemies.length >= CONFIG.maxEnemies) return;

  const max = Math.min(gameState.level + 1, ASSETS.prey.length - 2);
  const i = Math.floor(Math.random() * (max + 1));
  const dir = Math.random() > 0.5;
  const x = dir ? -100 : canvas.width + 100;
  const y = Math.random() * canvas.height;
  gameState.enemies.push(new Fish(i, x, y, dir));
}

function spawnShark() {
  const sharks = gameState.enemies.filter(e => e.type === 4);
  if (sharks.length >= CONFIG.maxSharks) return;
  if (gameState.frame % CONFIG.sharkSpawnInterval === 0) {
    const dir = Math.random() > 0.5;
    const x = dir ? -400 : canvas.width + 400;
    const y = Math.random() * canvas.height;
    gameState.enemies.push(new Fish(4, x, y, dir));
  }
}

function spawnBomb() {
  if (gameState.frame % 80 === 0) {
    gameState.bombs.push(new Bomb());
  }
}

function checkCollision() {
  // hero vs fish
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const e = gameState.enemies[i];
    const distHero = Math.hypot(gameState.hero.x - e.x, gameState.hero.y - e.y);

    if (distHero < gameState.hero.w / 2) {
      if (e.type <= gameState.level) {
        gameState.score += ASSETS.prey[e.type].value;
        gameState.enemies.splice(i, 1);
        gameState.hero.openMouth();
        grow();
        updateUI();
      } else {
        gameOver(e.type);
      }
    }
  }

  // shark eats any fish
  const sharks = gameState.enemies.filter(e => e.type === 4);
  sharks.forEach(shark => {
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
      const f = gameState.enemies[i];
      if (f.type === 4) continue;
      const dist = Math.hypot(shark.x - f.x, shark.y - f.y);
      if (dist < shark.w / 2) {
        gameState.enemies.splice(i, 1);
      }
    }
  });

  // any fish eats smaller fish
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const a = gameState.enemies[i];
    for (let j = gameState.enemies.length - 1; j >= 0; j--) {
      if (i === j) continue;
      const b = gameState.enemies[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < a.w / 2 && a.w > b.w + 5) {
        gameState.enemies.splice(j, 1);
      }
    }
  }

  // any fish vs bomb
  gameState.bombs.forEach(b => {
    if (b.exploded) return;
    const allFish = [...gameState.enemies, gameState.hero];
    for (let f of allFish) {
      const d = Math.hypot(f.x - b.x, f.y - b.y);
      if (d < b.radius) {
        b.explode();
        break;
      }
    }
  });
}

function grow() {
  if (gameState.score >= 3000) gameState.level = 3;
  else if (gameState.score >= 1000) gameState.level = 2;
  else if (gameState.score >= 200) gameState.level = 1;
  else gameState.level = 0;

  gameState.hero.update();
}

function updateUI() {
  document.getElementById("score-val").innerText = gameState.score;
  document.getElementById("level-name").innerText = CONFIG.heroNames[gameState.level];

  // show target fish
  const target = ASSETS.prey[Math.min(gameState.level, ASSETS.prey.length - 2)];
  document.getElementById("target-img").src = target.file;
  document.getElementById("target-name").innerText = target.name;
}

function gameOver(reason) {
  gameState.running = false;
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("end-title").innerText = "GAME OVER";
  document.getElementById("end-msg").innerHTML = `You got eaten by ${ASSETS.prey[reason].name}<br>Final Score: ${gameState.score}`;
}

/* ================= LOOP ================= */
function loop() {
  if (!gameState.running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // remove off-screen enemies
  gameState.enemies = gameState.enemies.filter(e => e.x > -200 && e.x < canvas.width + 200);

  if (gameState.frame % CONFIG.spawnEveryFrames === 0) spawnEnemy();
  spawnShark();
  spawnBomb();

  gameState.hero.move();
  gameState.hero.draw();

  gameState.enemies.forEach(e => {
    e.move();
    e.draw();
  });

  gameState.bombs.forEach(b => {
    b.move();
    b.draw();
  });

  checkCollision();

  gameState.frame++;
  requestAnimationFrame(loop);
}

/* ================= INPUT ================= */
addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

document.getElementById("restart-btn").onclick = () => {
  document.getElementById("end-screen").classList.add("hidden");
  startGame();
};

/* ================= STORY ================= */
function updateStory() {
  document.getElementById("story-title").innerText = STORY[slide].title;
  document.getElementById("story-text").innerText = STORY[slide].text;
  document.getElementById("story-avatar").src = STORY[slide].img;
}

document.getElementById("next-btn").onclick = () => {
  slide++;
  if (slide < STORY.length) {
    updateStory();
  } else {
    showLoadingTransition();
  }
};

document.getElementById("skip-btn").onclick = showLoadingTransition;

updateStory();

/* ================= LOADING TRANSITION ================= */
function showLoadingTransition() {
  document.getElementById("story-container").style.display = "none";

  const t = document.getElementById("bubble-transition");
  t.classList.remove("hidden");

  t.style.animation = "none";
  void t.offsetWidth;
  t.style.animation = "";

  setTimeout(() => {
    t.classList.add("hidden");
    document.getElementById("ui-layer").classList.remove("hidden");
    startGame();
  }, 2600);
}
