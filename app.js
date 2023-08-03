const userList = document.getElementById("user-list");

let userId;
// let userId = sessionStorage.getItem("id");
let userAdded = false;
function fetchUserList() {
  console.log(111);
  fetch("http://localhost:8000/api/users")
    .then((response) => response.json())
    .then((users) => {
      // Xóa danh sách người dùng cũ
      while (userList.firstChild) {
        userList.removeChild(userList.firstChild);
      }

      // Thêm danh sách người dùng mới
      users.forEach((user) => {
        const listItem = document.createElement("tr");
        const browserName = document.createElement("td"); // Lấy tên trình duyệt
        // browserName.innerText =
        //   user.browser.split(" ")[0] || user.browser.split("/")[0];
        const browserInfo = getBrowserInfo(user.browser); // Lấy thông tin trình duyệt
        browserName.innerText = browserInfo.name;
        const icon = document.createElement("td");
        const iconImage = document.createElement("img");
        if (user.browser.indexOf("Chrome") !== -1) {
          iconImage.src =
            "https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/512/chrome.png";
        } else if (user.browser.indexOf("Firefox") !== -1) {
          iconImage.src =
            "https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_firefox-512.png";
        } else if (user.browser.indexOf("Edg") !== -1) {
          iconImage.src =
            "https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_edge-256.png";
        }

        // iconImage.alt = user.browser;
        iconImage.width = 16;
        iconImage.height = 16;
        icon.appendChild(iconImage);
        const onlineTime = document.createElement("td");
        const currentTime = new Date();
        const createdAtTime = new Date(user.createAt);
        const timeInSeconds = Math.floor((currentTime - createdAtTime) / 1000);
        const minutes = Math.floor(timeInSeconds / 60);
        const hours = Math.floor(timeInSeconds / 3600);
        const days = Math.floor(timeInSeconds / 86400);

        if (days > 0) {
          onlineTime.innerText = days + " ngày";
        } else if (hours > 0) {
          onlineTime.innerText = hours + " giờ ";
        } else if (minutes > 0) {
          onlineTime.innerText = minutes + " phút";
        } else {
          onlineTime.innerText = timeInSeconds + " giây";
        }

        listItem.appendChild(browserName);
        listItem.appendChild(icon);
        listItem.appendChild(onlineTime);
        userList.appendChild(listItem);
      });
    })
    .catch((error) => console.error(error));
}
// Hàm lấy thông tin trình duyệt từ chuỗi trìnhduyệt
function getBrowserInfo(browserName) {
  const regex = /(Chrome|Firefox|Edg|Safari|Opera)\/(\S+)/; // Biểu thức chính quy
  const match = browserName.match(regex); // Tìm kiếm tên trình duyệt và số phiên bản

  let name = "Unknown";
  let version = "Unknown";

  if (match && match.length > 2) {
    name = match[1];
    version = match[2];
  } else {
    // Nếu không tìm thấy tên trình duyệt và số phiên bản, kiểm tra xem có tên trình duyệt không
    if (browserName.includes("Chrome")) {
      name = "Chrome";
    } else if (browserName.includes("Firefox")) {
      name = "Firefox";
    } else if (browserName.includes("Edg")) {
      name = "Edge";
    } else if (browserName.includes("Opera")) {
      name = "Opera";
    } else if (browserName.includes("Safari")) {
      name = "Safari";
    }
  }

  return { name: name, version: version };
}

if (userId == null || userId == "") {
  addUser();
}

function addUser() {
  const userAgent = navigator.userAgent;
  console.log("thông tin trình duyệt:", userAgent);
  if (userAgent.indexOf("Edg") !== -1) {
    console.log("Edge");
  }
  fetch("http://localhost:8000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      //   userAgent: navigator.vendor,
      //   icon: browserIcon,
    }),
  })
    .then((response) => response.json())
    .then((newUser) => {
      console.log("newusserrrr", newUser);
      // Lưu Id trả về vào biến userId
      //   userId = newUser.id;
      idN = newUser.id;
      //   sessionStorage.setItem("id", idN);
      //   userAdded = true;
    })
    .catch((error) => console.error(error));
}

window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  //   if (userAdded) {
  // Kiểm tra xem người dùng đã được thêm lên server hay chưa
  // let id = sessionStorage.getItem("id");
  fetch(`http://localhost:8000/api/users/${idN}`, {
    method: "DELETE",
  })
    .then((response) => {
      console.log(response);
      fetchUserList();
    })
    .catch((error) => console.error(error));
  //   }
  return (event.returnValue = "");
});
// window.addEventListener("beforeunload", function (id) {
//   //   event.preventDefault();
//   //   let userId = sessionStorage.getItem("userId");

//   console.log("userDELETE", id);
//   fetch(`http://localhost:8000/api/users/${id}`, {
//     method: "DELETE",
//   })
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((error) => console.error(error));
//   //   }
//   //   return (event.returnValue = "");
// });

// Định kỳ gọi hàm fetchUserList để cập nhật danh sách người dùng 3s
setInterval(fetchUserList, 3000);
