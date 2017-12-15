var header = document.getElementById("site-header").getElementsByTagName("header")[0];
var title = header.getElementsByTagName("a")[0];
var thumbnail = document.getElementById("site-thumbnail");
// Make constant because it is 0 when hidden
const THUMB_WIDTH = thumbnail.scrollWidth + parseInt(window.getComputedStyle(thumbnail).getPropertyValue("padding-left"), 10) + parseInt(window.getComputedStyle(thumbnail).getPropertyValue("padding-right"), 10) + +  parseInt(window.getComputedStyle(thumbnail).getPropertyValue("margin-left"), 10) + parseInt(window.getComputedStyle(thumbnail).getPropertyValue("margin-right"), 10);
const HEADER_PADDING = parseInt(window.getComputedStyle(header).getPropertyValue("padding-right"), 10) + parseInt(window.getComputedStyle(header).getPropertyValue("padding-left"), 10);
const TITLE_WIDTH = parseInt(window.getComputedStyle(title).getPropertyValue("margin-left"), 10) + parseInt(window.getComputedStyle(title).getPropertyValue("margin-right"), 10) + parseInt(window.getComputedStyle(title).getPropertyValue("padding-left"), 10) + parseInt(window.getComputedStyle(title).getPropertyValue("padding-right"), 10);
var thumbnailTimeout;
function showHideThumbnail() {
  if (!thumbnailTimeout) {
    thumbnailTimeout = setTimeout(function() {
      thumbnailTimeout = null;
      contentWidth = THUMB_WIDTH + HEADER_PADDING + TITLE_WIDTH + title.scrollWidth
      if (contentWidth > header.scrollWidth) {
        if (!thumbnail.classList.contains("hide")) {
          thumbnail.classList.add("hide");
        }
      } else {
        if (thumbnail.classList.contains("hide")) {
          thumbnail.classList.remove("hide");
        }
      }
    }, 70);
  }
}
window.addEventListener("load", showHideThumbnail);
window.addEventListener("resize", showHideThumbnail);
