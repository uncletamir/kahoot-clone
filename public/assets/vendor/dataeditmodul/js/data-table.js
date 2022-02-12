var socket = io();

var params = jQuery.deparam(window.location.search);
console.log(params);
socket.on('connect', function(){
  socket.emit('requestlistmodul', params);
  console.log(params);


});

socket.on ('responlistmodul', function(data){
  var ids = data.id;
  var nama = data.nama;
  console.log('view');
  console.log(nama);
});
socket.on('responlistmodul', function(data){
  if ($("table.first").length) {
    var listTr = document.getElementById('listku');
    var newListTr = document.createElement("tr");

    var listnama = document.createElement("td");
    var listka = document.createElement("td");
    var listkb = document.createElement("td");
    var listspertanyaan = document.createElement("td");
    var listspembahasan = document.createElement("td");
    var listEditButton = document.createElement("td");
    var listDeleteButton = document.createElement("td");
    var listPlayButton = document.createElement("td");

    listoid.innerHTML = data[i]._id;
    console.log(data[i]._id);
    listNo.innerHTML = data[i].id;
    console.log(data[i].id);
    listnama.innerHTML = data[i].question;
    console.log(data[i].name);
    listka.innerHTML = data[i].co;
    console.log(data[i].ka);
    listkb.innerHTML = data[i].kb;
    console.log(data[i].kb);
    listspertanyaan.innerHTML = data[i].spertanyaan;
    console.log(data[i].spertanyaan);
    listspembahasan.innerHTML = data[i].spembahasan;
    console.log(data[i].spembahasan);


  };
});
// jQuery(document).ready(function($) {
//     'use strict';
//
//
//
//
//
// });


socket.on('responlistmodul', function(data){
  if ($("table.first").length) {
    var listTr = document.getElementById('listku');
    var newListTr = document.createElement("tr");

    var listnama = document.createElement("td");
    var listka = document.createElement("td");
    var listkb = document.createElement("td");
    var listspertanyaan = document.createElement("td");
    var listspembahasan = document.createElement("td");
    var listEditButton = document.createElement("td");
    var listDeleteButton = document.createElement("td");
    var listPlayButton = document.createElement("td");

    listoid.innerHTML = data[i]._id;
    console.log(data[i]._id);
    listNo.innerHTML = data[i].id;
    console.log(data[i].id);
    listnama.innerHTML = data[i].question;
    console.log(data[i].name);
    listka.innerHTML = data[i].co;
    console.log(data[i].ka);
    listkb.innerHTML = data[i].kb;
    console.log(data[i].kb);
    listspertanyaan.innerHTML = data[i].spertanyaan;
    console.log(data[i].spertanyaan);
    listspembahasan.innerHTML = data[i].spembahasan;
    console.log(data[i].spembahasan);


};
});

// jQuery(document).ready(function($) {
//   'use strict';
//
// });



  socket.on('gameNamesData', function(data){
    console.log(data[1].questions[0].question);
  });

function startGame(data) {
    window.location.href="../../host/" + "?id=" + data;

}

function editPage(data) {
    window.location.href="../../edit/" + "?id=" + data;

}

function tambahSoal () {
  window.location.href="../uploadsoal";
}
