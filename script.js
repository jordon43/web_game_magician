if (localStorage.getItem("arr_name")){
    arr_name = JSON.parse(localStorage.getItem("arr_name"));
}
else {
    arr_name = new Array(0);
}

if (JSON.parse(localStorage.getItem("rating"))){
    map = new Map(JSON.parse(localStorage.getItem("rating")));
}
else {
    map = new Map();
}

name_player = localStorage["name"].toString();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

gameManager = new GameManager(ctx, canvas);

gameManager.loadAIl()

rAF = setInterval(() => gameManager.update(), 20);