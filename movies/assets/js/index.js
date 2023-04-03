"use strict";

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

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
  `https://api.themoviedb.org/3/genre/movie/list?${api_key}`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
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
      <div class="slider-item " slider-item>
        <img
          src="./assets/images/slider-banner.jpg"
          alt="puss in boots: the last wish"
          class="img-cover"
          loading="eager"
        />
        <div class="banner-content">
          <h2 class="heading">Puss in Boots: The Last Wish</h2>
          <div class="meta-list">
            <div class="meta-item">2022</div>
            <div class="meta-item card-badge">7.5</div>
          </div>
          <p class="genre">Animation,Action,Adventure</p>
          <p class="banner-text">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <a href="./detail.html" class="btn">
            <img
              src="./assets/images/play_circle.png"
              width="24"
              height="24"
              aria-hidden="true"
              alt="play circle"
            />
            <span class="span">watch now</span>
          </a>
        </div>
      </div>
    </div>
    <div class="slider-control">
      <div class="control-inner">
        <button class="poster-box slider-item ">
          <img
            src="./assets/images/slider-control.jpg"
            alt="slide to puss
        in boots:the last wish"
            loading="lazy"
            draggable="false"
            class="img-cover"
          />
        </button>
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

    sliderItem.innerHTML = ` <img
        src="${imageBaseURL}w1280${backdrop_path}"
        alt="${title}"
        class="img-cover"
        loading=${index === 0 ? "eager" : "lazy"}
      />
      <div class="banner-content">
        <h2 class="heading">${title}</h2>
        <div class="meta-list">
          <div class="meta-item">${release_date.split("-")[0]}</div>

          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>

        <p class="genre">${genreList.asString(genre_ids)}</p>

        <p class="banner-text">${overview}</p>
        <a href="./detail.html" class="btn">
          <img
            src="./assets/images/play_circle.png"
            width="24"
            height="24"
            aria-hidden="true"
            alt="play circle"
          />
          <span class="span">watch now</span>
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
  //addHeroSlide();
};
