console.log("upload connected");

const videoContainer = document.getElementById("video-container");

(async () => {
  try {
    const response = await axios.get("/upload-data");

    if (response.status === 200) {
      if (response?.data?.length) {
        videoContainer.innerHTML = response?.data?.map(
          (item) =>
            `<a class="col-span-4" href="/video?movie=${item}" ><div class="flex flex-col border w-full border-gray-50/20 cursor-pointer "  >
            <img src="./movie.jpg" alt="" class="h-[15rem] w-full object-cover ">
            <span class="w-full p-4 text-white  text-md font-medium tracking-wide">
                ${item}
            </span>
        </div></a>`
        );
      } else {
        videoContainer.innerText = "No data available";
      }
    }
  } catch (error) {
    alert(error?.message);
  }
})();
