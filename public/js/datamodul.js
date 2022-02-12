var socket = io();


socket.on('connect', function(){
    socket.emit('requestDbNames');//Get database names to display to user
});


socket.on('gameNamesData', function(data){
    for(var i = 0; i < Object.keys(data).length; i++){

      var listTr = document.getElementById('listku');
      var newListTr = document.createElement("tr");

      var listoid = document.createElement("td");
      var listNo = document.createElement("td");
      var listLabel = document.createElement("td");
      var listEditButton = document.createElement("td");
      var listDeleteButton = document.createElement("td");
      var listPlayButton = document.createElement("td");

      listoid.innerHTML = data[i]._id;
      console.log(data[i]._id);
      listNo.innerHTML = data[i].id;
      console.log(data[i].id);
      listLabel.innerHTML = data[i].name;
      console.log(data[i].name);
      listoid.setAttribute('class', 'list');
      listoid.setAttribute('id', 'oid' + data[i]._id);
      listoid.setAttribute('type', 'text');

      listEditButton.innerHTML = "Edit";
      listEditButton.setAttribute('class', 'editbutton');
      listEditButton.setAttribute('id', 'editbutton' + data[i]._id);
      listEditButton.setAttribute('class', 'btn btn-rounded btn-warning');
      listEditButton.setAttribute('onClick',"editmodul('"+ data[i].id +"')");

      listDeleteButton.innerHTML = "Delete";
      listDeleteButton.setAttribute('class', 'deletebutton');
      listDeleteButton.setAttribute('id', 'deletebutton' + data[i].id);
      listDeleteButton.setAttribute('class', 'btn btn-rounded btn-danger');
      listDeleteButton.setAttribute('onClick', "deletemodul('"+ data[i].id +"')");

      listPlayButton.innerHTML = "Play";
      listPlayButton.setAttribute('class', 'playbutton');
      listPlayButton.setAttribute('id', 'playbutton' + data[i].id);
      listPlayButton.setAttribute('class', 'btn btn-rounded btn-success');
      listPlayButton.setAttribute('onClick',"startGame('" + data[i].id + "')");


      newListTr.setAttribute('id', 'list');
      newListTr.appendChild(listLabel);
      newListTr.appendChild(listEditButton);
      newListTr.appendChild(listDeleteButton);
      newListTr.appendChild(listPlayButton);
      listTr.appendChild(newListTr);

    };
});

function startGame(data) {
    window.location.href="../../host/" + "?id=" + data;

}

function editmodul(data) {
    window.location.href="../../edit/" + "?id=" + data;
    console.log(editmodul);

}
function deletemodul(data){
  if (confirm("Apakah anda akan delete data ini?")){
  socket.emit('deletemodul',data);
  window.location.reload();
  }
}

function tambahSoal () {
  window.location.href="../create";
}
