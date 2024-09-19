// introduce scroll animation
const animate = 576,
  colorful = 359,
  desert = 688,
  element = 706,
  gray = 375,
  sea_above = 2577,
  sea_across = 831,
  snow = 714;
const target = ["colorfull", colorful];
(() => {
  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)

  const sceneInfo = {
    type: "sticky",
    // 브라우저 높이의 5배로 scrollHeight 세팅
    scrollHeight: 5 * window.innerHeight,
    objs: {
      container: document.querySelector("#scroll-section"),
      messageA: document.querySelector("#scroll-section .main-message.a"),
      messageB: document.querySelector("#scroll-section .main-message.b"),
      messageC: document.querySelector("#scroll-section .main-message.c"),
      messageD: document.querySelector("#scroll-section .main-message.d"),
      goBtn: document.querySelector(".go-main-btn"),
      canvas: document.querySelector("#video-canvas"),
      context: document.querySelector("#video-canvas").getContext("2d"),
      videoImages: [],
    },
    values: {
      videoImageCount: target[1],
      imageSequence: [0, target[1] - 1],
      canvas_opacity: [1, 0.1, { start: 0.9, end: 1 }],
      messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
      messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
      messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
      messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
      messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
      messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
      messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
      messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
      messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
      messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
      messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
      messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
      messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
      messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
      messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
      messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      button_opacity: [0, 1, { start: 0.95, end: 1 }],
      button_translateY_in: [100, -50, { start: 0.95, end: 1 }],
    },
  };

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo.values.videoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `video/${target[0]}/${i + 1}.jpg`;
      sceneInfo.objs.videoImages.push(imgElem);
    }
  }

  function setLayout() {
    // 스크롤 섹션 높이 세팅
    sceneInfo.objs.container.style.height = `${sceneInfo.scrollHeight}px`;
    yOffset = window.scrollY;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    // document.body.setAttribute("id", "show-scene-0");

    // const heightRatio = window.innerHeight / 1080;
    // sceneInfo.objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  }

  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo.scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo.objs;
    const values = sceneInfo.values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo.scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (yOffset < scrollHeight) {
      // if (!document.body.getAttribute("id")) {
      //   document.body.setAttribute("id", "show-scene-0");
      // }
      let sequence = Math.round(
        calcValues(values.imageSequence, currentYOffset)
      );
      objs.context.drawImage(objs.videoImages[sequence], 0, 0);

      objs.canvas.style.opacity = calcValues(
        values.canvas_opacity,
        currentYOffset
      );

      // objs.canvas.style.opacity = calcValues(
      //   values.canvas_opacity,
      //   currentYOffset
      // );

      if (scrollRatio <= 0.22) {
        // in
        objs.messageA.style.opacity = calcValues(
          values.messageA_opacity_in,
          currentYOffset
        );
        objs.messageA.style.transform = `translate3d(0, ${calcValues(
          values.messageA_translateY_in,
          currentYOffset
        )}%, 0)`;
      } else {
        // out
        objs.messageA.style.opacity = calcValues(
          values.messageA_opacity_out,
          currentYOffset
        );
        objs.messageA.style.transform = `translate3d(0, ${calcValues(
          values.messageA_translateY_out,
          currentYOffset
        )}%, 0)`;
      }

      if (scrollRatio <= 0.42) {
        // in
        objs.messageB.style.opacity = calcValues(
          values.messageB_opacity_in,
          currentYOffset
        );
        objs.messageB.style.transform = `translate3d(0, ${calcValues(
          values.messageB_translateY_in,
          currentYOffset
        )}%, 0)`;
      } else {
        // out
        objs.messageB.style.opacity = calcValues(
          values.messageB_opacity_out,
          currentYOffset
        );
        objs.messageB.style.transform = `translate3d(0, ${calcValues(
          values.messageB_translateY_out,
          currentYOffset
        )}%, 0)`;
      }

      if (scrollRatio <= 0.62) {
        // in
        objs.messageC.style.opacity = calcValues(
          values.messageC_opacity_in,
          currentYOffset
        );
        objs.messageC.style.transform = `translate3d(0, ${calcValues(
          values.messageC_translateY_in,
          currentYOffset
        )}%, 0)`;
      } else {
        // out
        objs.messageC.style.opacity = calcValues(
          values.messageC_opacity_out,
          currentYOffset
        );
        objs.messageC.style.transform = `translate3d(0, ${calcValues(
          values.messageC_translateY_out,
          currentYOffset
        )}%, 0)`;
      }

      if (scrollRatio <= 0.82) {
        // in
        objs.messageD.style.opacity = calcValues(
          values.messageD_opacity_in,
          currentYOffset
        );
        objs.messageD.style.transform = `translate3d(0, ${calcValues(
          values.messageD_translateY_in,
          currentYOffset
        )}%, 0)`;
      } else {
        // out
        objs.messageD.style.opacity = calcValues(
          values.messageD_opacity_out,
          currentYOffset
        );
        objs.messageD.style.transform = `translate3d(0, ${calcValues(
          values.messageD_translateY_out,
          currentYOffset
        )}%, 0)`;
      }
      if (scrollRatio <= 1) {
        // in
        objs.goBtn.style.visibility = "visible";
        objs.goBtn.style.opacity = calcValues(
          values.button_opacity,
          currentYOffset
        );
        objs.goBtn.style.transform = `translate3d(0, ${calcValues(
          values.button_translateY_in,
          currentYOffset
        )}%, 0)`;
      }
    }
  }
  window.addEventListener("scroll", () => {
    yOffset = scrollY;
    let scrollOpacity = document.querySelector(".scroll_icon");
    if (yOffset > 0) scrollOpacity.style.opacity = 0;
    else scrollOpacity.style.opacity = 1;
    playAnimation();
  });
  window.addEventListener("load", () => {
    // 로딩 화면 숨기기
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "none";

    // 메인 컨텐츠 보이기
    const mainContent = document.getElementById("main-content");
    mainContent.style.display = "block";
    setLayout();
    sceneInfo.objs.context.filter = "brightness(70%)";
    sceneInfo.objs.context.drawImage(sceneInfo.objs.videoImages[0], 0, 0);
  });
  window.addEventListener("resize", setLayout);

  setCanvasImages();
})();
