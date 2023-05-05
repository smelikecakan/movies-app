"use strict";

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

const homePageSections = [
  {
    title: "Yaklaşan Filmler",
    path: "/movie/upcoming",
  },
  {
    title: "Today's Trending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "En İyi Derecelendirilmiş Filmler",
    path: "/movie/top_rated",
  },
];

const genreList = {
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
    }
    return newGenreList.join(",");
  },
};

fetchDataFromServer(
  `
  https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=tr-TR`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1&language=tr-TR`,
      heroBanner
    );
  }
);

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider">
      <div class="slider-item " >
        <img
          src="./assets/images/slider-banner.jpg"
          alt="puss in boots: the last wish"
          class="img-cover"
          loading="eager"
        />
        <div class="banner-content">
         
          
        </div>
      </div>
    </div>
     <div class="slider-control">
      <div class="control-inner">
        
      </div>
    </div> 
  `;
  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");

    sliderItem.innerHTML = `
      <img
        src="${imageBaseURL}w1280${backdrop_path}"
        alt="${title}"
        class="img-cover"
        loading=${index === 0 ? "eager" : "lazy"}
      />
      <div class="banner-content">
        <h2 class="heading">${title}</h2>
        <div class="meta-list"></div>

        <br />

        <p class="banner-text">${overview}</p>
       
        
      </a>
        
      </div>
    `;

    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
      <img
        src="${imageBaseURL}w154${poster_path}"
        alt="slide to ${title}"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    `;
    banner.querySelector(".control-inner").appendChild(controlItem);
  }
  pageContent.appendChild(banner);
  addHeroSlide();

  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `
    https://api.themoviedb.org/3${path}/?api_key=${api_key}&page=1&language=tr-TR`,
      createMovieList,
      title
    );
  }
};

const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");

    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
  };

  /*addEventOnElements(sliderControls, "click", sliderStart);*/
  const addEventOnElements = function (elements, eventName, eventFunc) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener(eventName, eventFunc);
    }
  };

  let currentSlider = 0;
  const totalSliders = sliderItems.length;

  const changeSlider = function () {
    currentSlider++;
    if (currentSlider >= totalSliders) {
      currentSlider = 0;
    }
    sliderStart.call(sliderControls[currentSlider]);
  };

  let sliderInterval = setInterval(changeSlider, 5000);

  addEventOnElements(sliderControls, "click", function () {
    clearInterval(sliderInterval);
    sliderStart.call(this);
    currentSlider = Number(this.getAttribute("slider-control"));
    sliderInterval = setInterval(changeSlider, 2000);
  });
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large" id="title-large">${title}</h3>
    </div>
    <div class="slider-list">
      <div class="slider-inner">
        
          
        </div>
      </div>
    </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }
  pageContent.appendChild(movieListElem);
};
