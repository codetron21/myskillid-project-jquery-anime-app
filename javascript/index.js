const baseUrl = "https://api.jikan.moe/v4";

const topPath = "/top/anime";
const searchPath = "/anime?q=";

const topAnimeUrl = baseUrl + topPath;
const searchAnimeUrl = baseUrl + searchPath;

function onLoad() {
  $(document).ready(() => {
    getTopAnime();
    headerClickListener();
    searchClickListener();
    enterPressListener();
  });
}

function getTopAnime() {
  toggleLoading();
  $.get(topAnimeUrl, (response) => {
    const data = response.data;

    console.log(JSON.stringify(data));

    renderItemAnime(data);
    renderTotalResult(data);
    toggleLoading();
  });
}

function searchAnime(query) {
  toggleLoading();
  $.get(searchAnimeUrl + query, (response) => {
    const data = response.data;

    console.log(JSON.stringify(data));

    renderItemAnime(data);
    renderTotalResult(data);
    toggleLoading();
  });
}

function searchClickListener() {
  $(".search-icon-container").on("click", () => {
    const query = $("#search-input").val();
    $("#content-list").empty();
    if (!query) {
      $(".total-results").text("No Results!");
      return;
    }

    searchAnime(query);
  });
}

function headerClickListener() {
  $(".header-title").on("click", () => {
    $("#content-list").empty();
    getTopAnime();
  });
}

function enterPressListener() {
  $(document).keypress((e) => {
    if (e.which == 13) {
      const query = $("#search-input").val();
      $("#content-list").empty();
      if (!query) {
        $(".total-results").text("No Results!");
        return;
      }

      searchAnime(query);
    }
  });
}

function renderItemAnime(data) {
  const elements = data.map((d) => {
    try {
      const item = $("<div></div>");
      item.addClass("item-container");

      const image = $("<img/>");
      image.attr("src", `${d.images.jpg.image_url}`);
      image.attr("alt", "Poster");
      image.addClass("item-image");

      const detailsContainer = $("<div></div>");
      detailsContainer.addClass("item-details-container");

      const title = $("<h2></h2>");
      title.addClass("item-title");
      title.text(d.title);

      const description = $("<p></p>");
      description.addClass("item-description");
      description.text(truncateString(d.synopsis));

      detailsContainer.append(title, description);
      item.append(image, detailsContainer);

      const itemList = $("<li></li>");
      itemList.addClass("item-list");
      itemList.append(item);

      return itemList;
    } catch (err) {
      console.log(err.message);
      return null;
    }
  });

  const content = $("#content-list");
  content.append(elements);

  $("#content-list").append(content);
}

function renderTotalResult(data) {
  const size = data.length;

  $(".total-results").text(size);
}

function toggleLoading() {
  $("#content-loading").toggleClass("loader");
}

function truncateString(str) {
  let result = str.substring(0, 100);
  result += str.length > 100 ? "..." : "";
  return result;
}

onLoad();
