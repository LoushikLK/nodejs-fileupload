console.log("upload connected");

const videoContainer = document.getElementById("video-container");

const handleClick = async (name) => {
  try {
    const response = await axios.get("/upload-data/" + name);
    console.log(response);
  } catch (error) {
    console.log(error);
    alert(error?.message);
  }
};

(async () => {
  try {
    const response = await axios.get("/upload-data");

    if (response.status === 200) {
      if (response?.data?.length) {
        videoContainer.innerHTML = response?.data?.map(
          (item) =>
            `<div class="flex flex-col border col-span-4 border-gray-50/20 cursor-pointer " onclick=handleClick("${item}") >
            <img src="./movie.jpg" alt="" class="h-[15rem] w-full object-cover ">
            <span class="w-full p-4 text-white  text-md font-medium tracking-wide">
                ${item}
            </span>
        </div>`
        );
      } else {
        videoContainer.innerText = "No data available";
      }
    }
  } catch (error) {
    alert(error?.message);
  }
})();
