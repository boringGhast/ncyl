time();
let sIcon = document.getElementById("search-ico");
let searchIN = document.getElementById("search");
let setSearch = document.getElementById("setSearchHref");
let hrefB = document.getElementById("hrefbox");
let hrefs = document.querySelectorAll(".href");
let shref = "https://www.bing.com/search?q=";

// 设置切换搜索引擎
function setSearchHref(e) {
  shref = e.getAttribute("shref");
  sIcon.className = e.firstChild.nextElementSibling.className;
  searchIN.focus();
}

function search() {
  let searchText = document.getElementById("search").value;
  document.getElementById("search").value = "";
  open(shref + searchText);
}

// 设置按下enter键搜索
searchIN.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.key == "Enter") {
    search();
  }
});

//设置时间
function time() {
  let mydate = new Date();
  h = mydate.getHours();
  m = mydate.getMinutes();
  s = mydate.getSeconds();

  //如果小于10则加 0补位
  function check(i) {
    let num = Number(i) < 10 ? "0" + i : i;
    return num + "";
  }
  h = check(h);
  m = check(m);
  s = check(s);
  nowtime = h + ":" + m + ":" + s;
  document.getElementById("time").innerText = nowtime;
}

// 获取元素浏览器边框的距离
function getElementLeft(element) {
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;

  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }

  return actualLeft;
}

function getElementTop(element) {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
}

let pos;
function showhrefB() {
  let hrefBLeft = (getElementLeft(setSearch) - 20).toString();
  let hrefBTop = (getElementTop(setSearch) + 55).toString();
  pos = "top: " + hrefBTop + "px;" + "left:" + hrefBLeft + "px;";
  hrefB.style = "transform: scale(1);" + pos;
}

// 设置深浅模式切换 深色在前
let nightOrDayMode = 1;
let changeList = {
  "--timeColor": ["#444444", "#e3e3e3"],
  "--searchColor": ["50", "255"],
  "--searchTaB": ["#eeeeee", "black"],
  "--libg": ["#eeeeee22", "#66666611"],
  "--addColor": ["#dddddd", "#1b1b1b"],
  "--bgColor": ["#034140", "#0d6766"],
};
function nightOrDay() {
  function change() {
    for (let i in changeList) {
      document.documentElement.style.setProperty(
        i,
        changeList[i][nightOrDayMode]
      );
    }
  }
  if (nightOrDayMode === 1) {
    nightOrDayMode = 0;
  } else {
    nightOrDayMode = 1;
  }
  change();
}

let add = '<div class="tile">' + getAddTilesElement().innerHTML + "</div>";

let tileHref, tileName, tiles, setLogeDemoColor;
tiles = document.getElementsByClassName("tiles")[0];
setLogeDemoColor = document.getElementById("setLogeColor");
// 如果本地储存有tiles数据则赋值给tilesBox.innerHTML
tiles.innerHTML = localStorage.getItem("tiles") || tiles.innerHTML;

//为AddTiles添加事件
let AddTiles, full;
AddTiles = document.querySelector("#AddTiles");
AddTiles.addEventListener("click", newTileCard_off_on);
//为full添加事件
full = document.querySelector("#full");
full.addEventListener("click", newTileCard_off_on);
//修改后的网址卡片相关代码显示和隐藏
function newTileCard_off_on() {
  let full = document.querySelector("#full");
  let newTileCard = document.querySelector("#newTileCard");
  //获取full的display属性值
  let full_display = window.getComputedStyle(full, null).display;
  //判断display属性值
  if (full_display == "none") {
    newTileCard.style.display = "flex";
    full.style.display = "flex";
  } else {
    newTileCard.style.display = "none";
    full.style.display = "none";
  }
}

function SetLogeDemoText() {
  let textLoge = document.getElementById("textLoge");
  textLoge.value = textLoge.value.substring(0, 3);
  document.getElementById("logeDemo").innerHTML =
    '<p class="f32 tileText">' + textLoge.value + "</p>";
}

function addTile() {
  tileHref = document.getElementById("tileHref");
  tileName = document.getElementById("tileName");
  if (tileHref.value == "" || tileName.value == "") {
    alert("网址或名称不能为空");
    return;
  }

  let color = setLogeDemoColor.value;
  let href =
    tileHref.value.indexOf("https://", 0) == "-1" ||
    tileHref.value.indexOf("http://", 0) == "-1"
      ? "https://" + tileHref.value
      : tileHref.value;
  let newTile =
    '<div class="tile">' +
    '<a href="' +
    href +
    '" target="_blank" aria-label="' +
    tileName.value +
    '">' +
    '<div class="text" style="background:' +
    color +
    ';"><p class="f32">' +
    document.getElementById("textLoge").value +
    '</p></div></a><p class="ceeeeee">' +
    tileName.value +
    "</p></div>";
  tiles.innerHTML += newTile + add;
  tiles.removeChild(getAddTilesElement());
  tiles.lastChild.setAttribute("add", "add");
  localStorage.setItem("tiles", tiles.innerHTML);
  // 重新添加add图标后重新赋值变量
  AddTiles = document.querySelector("#AddTiles");
  AddTiles.addEventListener("click", newTileCard_off_on);
  full = document.querySelector("#full");
  full.addEventListener("click", newTileCard_off_on);
  setTilesRight();
}

function getAddTilesElement() {
  let tiles = document.getElementsByClassName("tile");
  for (let i of tiles) {
    if (i.getAttribute("add") == "add") {
      return i;
    }
  }
}

// 设置tiles的右键菜单
let rightOf;
function setTilesRight() {
  let tiles = document.getElementsByClassName("tile");

  for (let i of tiles) {
    if (i === getAddTilesElement()) {
      continue;
    }
    i.oncontextmenu = function (e) {
      rightOf = this;
      //取消默认的浏览器自带右键 很重要！！
      e.preventDefault();

      //获取我们自定义的右键菜单
      let menu = document.querySelector("#tilesRightMenu");

      //根据事件对象中鼠标点击的位置，进行定位
      menu.style.left = e.clientX + "px";
      menu.style.top = e.clientY + "px";

      //改变自定义菜单的宽，让它显示出来
      menu.style.display = "block";
    };
  }
}

setTilesRight();

//关闭右键菜单，很简单
window.onclick = function () {
  //用户触发click事件就可以关闭了，因为绑定在window上，按事件冒泡处理，不会影响菜单的功能
  document.querySelector("#tilesRightMenu").style.display = "none";
};

function delTile() {
  rightOf.remove();
  localStorage.setItem("tiles", tiles.innerHTML);
}

document.getElementById("btnSLC").onclick = function () {
  setLogeDemoColor = document.getElementById("setLogeColor");
  setLogeDemoColor.click();
};

window.onload = function () {
  setInterval(
    "document.documentElement.style.setProperty('--logeDemoColor', setLogeDemoColor.value);",
    50
  );
  setInterval("time()", 1000);
};
localStorage.removeItem("tiles");
