function changegroup() {
    var value = document.getElementById("gruppe").value;
    console.log(value);

    var x = document.getElementById("scene");
    try {    while (x.options.length > 0) {
        x.remove(0);
    }}catch{ console.log("error"); }
    let newOption = new Option("Aus","false");
    x.add(newOption,undefined);
    scene.forEach(element => {

        if(value == element.group){
            console.log(element);
            let newOption = new Option(element.name,element.id);
            x.add(newOption,undefined);
        }
    });
}
var socket = io();
socket.on('huebridge', function(data) {
    console.log(data);
    document.getElementById('ip__').style.display = "block";
    document.getElementById('searchip').style.display = "none";
    var x = document.getElementById("ip");
    let newOption = new Option(data.internalipaddress,data.internalipaddress);
    x.add(newOption,undefined);
});8