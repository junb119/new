var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  twopi = Math.PI * 2,
  parts = [],
  sizeBase,
  cw,
  ch,
  opt,
  hue,
  count,
  fps = 30, // FPS 제한
  now,
  then = Date.now(),
  interval = 1000 / fps,
  delta;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function hsla(h, s, l, a) {
  return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
}

function createParticles() {
  sizeBase = cw + ch;
  parts.length = 0;
  count = Math.floor((cw + ch) * 0.02); // 파티클 수 줄이기
  for (var i = 0; i < count; i++) {
    parts.push({
      radius: rand(1, sizeBase * 0.03),
      x: rand(0, cw),
      y: rand(0, ch),
      angle: rand(0, twopi),
      vel: rand(0.1, 0.3), // 속도 감소
      tick: rand(0, 10000),
      color: hsla(rand(0, 360), 70, 50, 0.3), // 파티클 색상 캐시
    });
  }
}

function init() {
  resize();
  createParticles();
  loop();
}

function loop() {
  requestAnimationFrame(loop);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    ctx.clearRect(0, 0, cw, ch);

    var i = parts.length;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#fff";
    while (i--) {
      var part = parts[i];

      part.x += Math.cos(part.angle) * part.vel;
      part.y += Math.sin(part.angle) * part.vel;
      part.angle += rand(-0.05, 0.05);

      ctx.beginPath();
      ctx.arc(part.x, part.y, part.radius, 0, twopi);
      ctx.fillStyle = part.color;
      ctx.fill();

      // 경계를 넘는 경우 화면 반대편으로 이동
      if (part.x - part.radius > cw) {
        part.x = -part.radius;
      }
      if (part.x + part.radius < 0) {
        part.x = cw + part.radius;
      }
      if (part.y - part.radius > ch) {
        part.y = -part.radius;
      }
      if (part.y + part.radius < 0) {
        part.y = ch + part.radius;
      }

      part.tick++;
    }
  }
}

function resize() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
  createParticles();
}

window.addEventListener("resize", resize);
// window.addEventListener("click", createParticles);

init();
var colors = [
  [107, 99, 170],
  [82, 181, 82],
  [177, 89, 114],
  [45, 175, 230],
  [189, 74, 189],
  [189, 122, 54],
];

var step = 0;
var colorIndices = [0, 1, 2, 3];
var gradientSpeed = 0.005;

// function updateGradient() {
//   var c0_0 = colors[colorIndices[0]];
//   var c0_1 = colors[colorIndices[1]];
//   var c1_0 = colors[colorIndices[2]];
//   var c1_1 = colors[colorIndices[3]];

//   var istep = 1 - step;
//   var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
//   var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
//   var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
//   var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

//   var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
//   var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
//   var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
//   var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

//   var element = document.getElementById("portfolio");
//   element.style.background = `-webkit-gradient(linear, left top, right top, from(${color1}), to(${color2}))`;
//   element.style.background = `-moz-linear-gradient(left, ${color1} 0%, ${color2} 100%)`;

//   step += gradientSpeed;
//   if (step >= 1) {
//     step %= 1;
//     colorIndices[0] = colorIndices[1];
//     colorIndices[2] = colorIndices[3];

//     colorIndices[1] =
//       (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) %
//       colors.length;
//     colorIndices[3] =
//       (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) %
//       colors.length;
//   }
// }

// setInterval(updateGradient, 10);
