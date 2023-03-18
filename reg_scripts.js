const input_name = document.getElementById('input_name');
const text_name = document.getElementById('text_name');

function store(source) {
    localStorage.setItem("name",source.toString());
    console.log(localStorage["name"]);
}

function read(source) {
    source.value = localStorage["tetris.username"];
}

function haveChanges(){
    console.log(JSON.parse(localStorage.getItem("myKey")));
}

map1 = new Map(JSON.parse(localStorage.getItem("rating")));
console.log(map1);