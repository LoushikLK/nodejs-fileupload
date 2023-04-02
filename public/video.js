console.log("video connected");

const videoPlayer = document.getElementById("video-player");

console.log(window.location?.search);
(async () => {
  try {
    const file = window.location?.search?.split("=")[1];

    videoPlayer.setAttribute("src", `/upload-data/${file}`);
    videoPlayer.setAttribute("autoplay", "true");
  } catch (error) {
    alert(error?.message);
  }
})();
