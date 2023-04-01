console.log("connected");
// import axios from "axios";

const fileInput = document.getElementById("file");
const inputDiv = document.getElementById("upload");
const uploadingDiv = document.getElementById("uploading");
const progressBar = document.getElementById("meter");
const uploadingText = document.getElementById("uploading-text");

inputDiv.onclick = () => {
  fileInput.click();
};

function formatBytes(bytes, binaryUnits) {
  if (bytes == 0) {
    return "0 Bytes";
  }
  var unitMultiple = binaryUnits ? 1024 : 1000;
  var unitNames =
    unitMultiple === 1024 // 1000 bytes in 1 Kilobyte (KB) or 1024 bytes for the binary version (KiB)
      ? ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
      : ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  var unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
  return (
    parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(2)) +
    " " +
    unitNames[unitChanges]
  );
}

fileInput.onchange = async (e) => {
  try {
    let formData = new FormData();
    e?.target?.files[0] && formData.append("file", e?.target?.files[0]);

    inputDiv.style.display = "none";
    uploadingDiv.style.display = "flex";

    const response = await axios.post("/upload", formData, {
      onUploadProgress: (progress) => {
        progressBar.style.strokeDashoffset = Number(
          (100 - Math.floor(Number(progress?.progress) * 100)) * 3.6
        );
      },
    });

    if (response.status === 200) {
      uploadingText.innerText = "Uploaded successfully";
    }
  } catch (error) {
    uploadingText.innerText = "Uploaded failed";
  }
};
