window.onload = () => {
  const container = document.querySelector(".container");
  const pages = document.querySelectorAll("main .page");
  const navs = document.querySelectorAll("header li");

  const swiper = new Swiper(".swiper", {
    // Optional parameters
    simulateTouch: false,
    direction: "horizontal",
    // If we need pagination
    pagination: {
      // el: '.swiper-pagination',
    },

    // Navigation arrows
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev",
    // },

    // And if we need scrollbar
    scrollbar: {
      // el: '.swiper-scrollbar',
    },
  });

  navs.forEach((nav, idx) => {
    nav.addEventListener("click", (e) => {
      navs.forEach((nav, idx) => {
        nav.querySelector("a").classList.remove("active");
      });
      nav.querySelector("a").classList.add("active");
      swiper.slideTo(idx);
    });
  });

  navs[1].addEventListener("click", () => setProgressBar(skillboxs[0]));
  // setProgressBar(skillboxs[0])
};

// skill
const skillBtns = document.querySelectorAll("#skill .list_nav button");

const skillLists = document.querySelectorAll(".selected_skill > li h3");
const skillTitle = document.querySelector(".selected_skill h3");
const skillboxs = document.querySelectorAll(".skill_container .skill_box");

skillBtns.forEach((btn, btnIdx) => {
  btn.addEventListener("click", () => {
    setSkill(btn, btnIdx);
  });
});

function setProgressBar(bars) {
  const progressBars = bars.querySelectorAll("li .progress_bar");
  progressBars.forEach((bar) => {
    const barWidth = bar.dataset.progress;
    bar.style.width = barWidth + "%";
  });
}

function setSkill(btn, btnIdx) {
  const targetTitle = btn.innerText;

  skillTitle.innerText = targetTitle;
  if (!skillBtns[btnIdx].classList.contains("show")) {
    skillboxs.forEach((list, skillIdx) => {
      skillBtns[skillIdx].classList.remove("show");
      skillboxs[skillIdx].classList.remove("show");
    });
    skillBtns[btnIdx].classList.add("show");
    skillboxs[btnIdx].classList.add("show");

    setProgressBar(skillboxs[btnIdx]);
  }
}
// --skill
// console.log(skillBtns[0]);

// portfolio

// element argument can be a selector string
//   for an individual element

// iso.arrange({
//   // item element provided as argument
//   filter: function (itemElem) {
//     var number = itemElem.querySelector(".number").innerText;
//     return parseInt(number, 10) > 50;
//   },
// });

// store filter for each group
function setIsotope() {
  var filters = {};

  var grid = document.querySelector(".grid");
  var iso = new Isotope(grid, {
    percentPosition: false,
    itemSelector: ".grid-item",
    layoutMode: "masonry", // layoutMode를 packery로 변경
    masonry: {
      gutter: 5, // 아이템 간격
      // 열 크기 설정 (원하는대로 변경 가능)
      columnWidth: 120,
      // horizontalOrder: true,
      fitWidth: true,
    },
    // originLeft: false,
  });

  // Handle button clicks
  document
    .querySelectorAll("#portfolio .button-group")
    .forEach(function (buttonGroup) {
      buttonGroup.addEventListener("click", function (event) {
        if (event.target.matches("button")) {
          var button = event.target;
          var filterGroup =
            button.parentElement.getAttribute("data-filter-group");
          var filterValue = button.getAttribute("data-filter");
          // Update filter for the group
          filters[filterGroup] = filterValue;
          // Combine filters

          buttonGroup.querySelectorAll("button").forEach((btn) => {
            btn.classList.remove("show");
          });
          button.classList.add("show");
          console.log("1", filters);

          var combinedFilter = concatValues(filters);
          iso.arrange({ filter: combinedFilter });
          iso.shuffle();
        }
      });
    });

  // Flatten object by concatenating values
  function concatValues(obj) {
    console.log("3");

    var value = "";
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        value += obj[prop];
      }
    }
    return value || "*";
  }
}

// Initialize Isotope

fetch("./data/portfolio.json")
  .then((response) => response.json())
  .then((data) => {
    for (let gridItem of data) {
      const grid = document.querySelector(".grid");
      const filter = gridItem.filter.join(" ");
      grid.innerHTML += `<figure
          class="grid-item ${filter}"
        >
          <img src="${gridItem.thumb}" alt="${gridItem.title}" />
          <figcaption id="${gridItem.id}">${gridItem.title}</figcaption>
        </figure>`;
    }

    setIsotope();
    setDialog();
    console.log(data);
  })
  .catch((error) => {
    console.error("Error fetching the portfolio:", error);
  });

function setDialog() {
  const thumbs = document.querySelectorAll("#portfolio figcaption");
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      fetch("./data/portfolio.json")
        .then((response) => response.json())
        .then((datas) => {
          const id = thumb.getAttribute("id");
          const dialog = document.getElementById("dialog-content");
          const dialogImg = dialog.querySelector(".portfolio_dialog_bg img");
          const dialogTitle = dialog.querySelector(
            ".portfolio_dialog_textBox h3"
          );
          const dialogDirect = dialog.querySelector(
            ".portfolio_dialog_textBox .portfolio_direct"
          );
          const dialogSkills = dialog.querySelector(
            ".portfolio_dialog_textBox ul"
          );
          const dialogDesc = dialog.querySelector(
            ".portfolio_dialog_textBox .dialog_desc"
          );
          const dialogFeauture = dialog.querySelector(
            ".portfolio_dialog_textBox .feature ul"
          );
          for (let data of datas) {
            if (data.id === id) {
              dialogImg.setAttribute("src", data.bg);
              dialogImg.setAttribute("alt", data.title);
              dialogTitle.innerText = data.title;
              dialogDirect.setAttribute("href", data.github);
              let skilllist = "";
              data.skills.forEach((skill) => {
                skilllist += `<li>${skill}</li>`;
              });
              dialogSkills.innerHTML = skilllist;
              let descList = "";
              data.desc.forEach((desc) => {
                descList += `<p>${desc}</p>`;
              });
              dialogDesc.innerHTML = descList;
              features = "";
              data.feature.forEach((feature) => {
                features += `<li>${feature}</li>`;
              });
              dialogFeauture.innerHTML = features;
            }
          }
          Fancybox.show([{ src: "#dialog-content", type: "inline" }]);
        })
        .catch((error) => {
          console.error("Error fetching the portfolio:", error);
        });
    });
  });
}

// --portfolio
