const shortBtn = document.getElementById("short-btn");
const reloadBtn = document.getElementById("reload-btn");

shortBtn.addEventListener("click", shortenUrl);

function shortenUrl() {
  let originalUrl = document.getElementById("originalUrl").value;
  let apiUrl =
    "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(originalUrl);
  shortenUrlTextarea = document.getElementById("shortenedUrl");

  fetch(apiUrl)
    .then((response) => response.text())
    .then((data) => {
      shortenUrlTextarea.value = data;
    })
    .catch(
      (error) => (shortenedUrlTextarea.value = "Error : Unable to shorten URL!")
    );
}

reloadBtn.addEventListener("click", () => {
  location.reload();
});
