window.onload = () => {
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

  fetchData("./data/skillList.json", fetchSkill);
  fetchData("./data/portfolio.json", fetchPortfolio);

  // setProgressBar(skillboxs[0])
  function fetchData(path, callback) {
    fetch(path)
      .then((response) => response.json())
      .then((datas) => {
        callback(datas);
      })
      .catch((error) => {
        console.error("Error fetching the portfolio:", error);
      });
  }
  // skill

  function fetchSkill(datas) {
    const skill_container = document.querySelector("#skill .skill_container");

    for (let data of datas) {
      skill_container.innerHTML += `
    <li id="skill_box_${data.category}" class="skill_box">
      <ul>
      </ul>
    </li>
    `;

      const skill_box = skill_container.querySelector(
        `#skill_box_${data.category} ul`
      );

      for (let skill of data.skills) {
        skill_box.innerHTML += `<li class="df">
            <div class="skill_category">
              <img src="${skill.img}" alt="${skill.name}" />
            </div>
            <div class="skill_descript">
              <h4 class="skill_name">${skill.name}</h4>
              <div class="progress_bg">
                <div class="progress_bar" data-progress="${skill.achivement}">0%</div>
              </div>
              <p class="skill_comment">${skill.comment}</p>
            </div>
          </li>`;
      }
    }
    const skillBtns = document.querySelectorAll("#skill .list_nav button");
    const skillLists = document.querySelectorAll(".selected_skill > li h3");
    const skillTitle = document.querySelector(".selected_skill h3");
    const skillboxs = document.querySelectorAll(".skill_container .skill_box");

    function setProgressBar(bars) {
      const progressBars = bars.querySelectorAll("li .progress_bar");
      progressBars.forEach((bar) => {
        const barWidth = bar.dataset.progress;
        bar.style.width = barWidth + "%";
      });
    }

    function setSkill(btn, btnIdx) {
      skillTitle.innerText = btn.innerText;
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
    skillBtns.forEach((btn, btnIdx) => {
      btn.addEventListener("click", () => {
        setSkill(btn, btnIdx);
      });
    });
    navs[1].addEventListener("click", () => {
      setSkill(skillBtns[0], 0);
    });
  }
  // --skill

  // portfolio

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
            // console.log("1", filters);

            var combinedFilter = concatValues(filters);
            iso.arrange({ filter: combinedFilter });
            iso.shuffle();
          }
        });
      });

    // Flatten object by concatenating values
    function concatValues(obj) {
      // console.log("3");

      var value = "";
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          value += obj[prop];
        }
      }
      return value || "*";
    }
  }
  function fetchPortfolio(data) {
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
  }

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
};
