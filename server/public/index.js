var socket = io();
socket.on('update', function(data) {
    document.getElementById(data.nutzer).innerText  = "Raum:  " + data.raum;
});
socket.on('user_scan_result', function(data) {
  console.log(JSON.parse(data));
  JSON.parse(data).forEach(device => {
    console.log(device);
    var x = document.getElementById("ble_mac");
    var option = document.createElement("option");
    option.text = device.name + "(" + device.mac + ")";
    option.value = device.mac;
    x.add(option, x[0])
  })
});
$('#changeModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var recipient = button.data('esp_id');
    var name = button.data('name');
    var id = button.data('id');
    var modal = $(this);
    modal.find('.modal-title').text(name + " bearbeiten");
    modal.find('#raum_id').val(recipient);
    modal.find('#traindata').attr("href", "/learning/?id=" + recipient);
    modal.find('#id').val(id);
    modal.find('#delete_room').attr("href", "/raeume/delete?id=" + recipient);
    modal.find('#delete_person').attr("href", "/personen/delete?id=" + id);
  })
  let mac = document.getElementById('mac');
  var person_mac;
  mac.addEventListener ("change", function () {
    person_mac = this.value;
  });
function learning(id){
  socket.emit('learning', {id: id, mac: person_mac})
  var button = document.getElementById('id' + id);
  button.innerText = "Stop";
  button.setAttribute( "onClick", "stop('" + id + "')");
}
function stop(id){
  console.log("stop");
  var button = document.getElementById('id' + id);
  button.innerText = "Ready";
  button.setAttribute( "onClick", "");
  socket.emit('stoplearning',"stop")
}
function show_safe_software(){
  document.getElementById('save_button_software').style.display = "block";
}
function user_scan(){
  socket.emit("user_scan", "user_scan");
}