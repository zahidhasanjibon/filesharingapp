const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#file-input");
const browseBtn = document.querySelector(".browseBtn");
const form = document.querySelector("#form");
const host = "http://localhost:5000/";
const uploadUrl = `${host}api/files`;
const progressContainer = document.querySelector(".progress-container");
const sharingContainer = document.querySelector(".sharing-container");
const emailContainer = document.querySelector(".email-container");
const bgProgress = document.querySelector(".bg-progress");
const percentCounter = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const urlInput = document.querySelector("#file-url-input");
const copyBtn = document.querySelector("#copy-content");
const emailTitle = document.querySelector(".emailTitle");
const emaiForm = document.querySelector("#email-form");
const toast = document.querySelector(".toast");
const maxFileLimit = 100 * 1000 * 1000;

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});
dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
  }
  uploadFile();
});
browseBtn.addEventListener("click", () => {
  fileInput.click();
});
fileInput.addEventListener("change", () => {
  uploadFile();
});

copyBtn.addEventListener("click", () => {
  urlInput.select();
  document.execCommand("copy");
  showToast("link copied");
});

emaiForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const uuid = urlInput.value.split("/").splice(-1, 1)[0];

  const formData = {
    uuid: uuid,
    emailFrom: emaiForm.elements["senderEmail"].value,
    emailTo: emaiForm.elements["receiverEmail"].value,
  };
  fetch(`${host}api/files/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      emailContainer.style.display = "none";
      sharingContainer.style.display = "none";
      showToast(`Email sent to ${emaiForm.elements["receiverEmail"].value}`);
      setTimeout(() => {
        location.reload();
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
    });

  // emailForm[2].setAttribute("disabled", "true");
});

// function uploadFile() {
//   const file = fileInput.files[0];
//   console.log(file);
//   let formData = new FormData();
//   formData.append("myfile", file);
//   //   let formObject = {};
//   //   for (let [key, value] of formData.entries()) {
//   //     formObject[key] = value;
//   //   }
//   //   console.log(formObject);
//   //   console.log(formData);
//   fetch(uploadUrl, {
//     method: "post",
//     body: formData,
//   })
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log("err");
//       console.log(err);
//     });
// }

const uploadFile = () => {
  if (fileInput.files.length > 1) {
    fileInput.value = "";
    showToast("upload only single file allowed");
    return;
  }
  files = fileInput.files;
  if (files[0].size > maxFileLimit) {
    fileInput.value = "";
    showToast("file limit 100 MB");
    return;
  }
  const formData = new FormData();
  formData.append("myfile", files[0]);

  progressContainer.style.display = "block";
  //show the uploader

  // upload file
  const xhr = new XMLHttpRequest();
  // // listen for response which will give the link
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };
  xhr.upload.onprogress = updateProgress;
  xhr.upload.onerror = () => {
    fileInput.value = "";
    showToast(`Error in upload ${xhr.statusText}`);
  };
  xhr.open("POST", uploadUrl);
  // xhr.upload.addEventListener("progress", (e) => {
  //   console.log(e);
  // });
  // xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.send(formData);
};

const updateProgress = (e) => {
  let percent = Math.round((e.loaded / e.total) * 100);
  bgProgress.style.width = `${percent}%`;
  percentCounter.innerText = percent;
  progressBar.style.width = `${percent}%`;
};

const onUploadSuccess = ({ file: link }) => {
  // emailForm[2].removeAttribute("disabled");
  // fileInput.value = "";
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  emailContainer.style.display = "block";
  emailTitle.style.display = "block";
  urlInput.value = link;
};

const showToast = (msg) => {
  let toastTimer;
  toast.style.transform = "translate(-50%,0)";
  toast.innerHTML = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%,100px)";
  }, 2000);
};
