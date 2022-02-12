var socket = io();

socket.on('connect', function(){
    socket.emit('requestDbNames');//Get database names to display to user
});

socket.on('gameNamesData', function(data){
    for(var i = 0; i < Object.keys(data).length; i++){
      console.log(Object.keys(data));
      var listTr = document.getElementById('listku');
      var newListTr = document.createElement("tr");

      var listLabel = document.createElement("td");
      var listEditButton = document.createElement("td");
      var listDeleteButton = document.createElement("td");
      var listPlayButton = document.createElement("td");

      listLabel.innerHTML = data[i].name;
      console.log(data[i].name);
      listLabel.setAttribute('class', 'list');
      listLabel.setAttribute('id', 'gameList' + data[i].id);
      listLabel.setAttribute('type', 'text');

      listEditButton.innerHTML = "Edit";
      listEditButton.setAttribute('class', 'editbutton');
      listEditButton.setAttribute('id', 'editbutton' + data[i].id);
      listEditButton.setAttribute('type', 'button');

      listDeleteButton.innerHTML = "Delete";
      listDeleteButton.setAttribute('class', 'deletebutton');
      listDeleteButton.setAttribute('id', 'deletebutton' + data[i].id);
      listDeleteButton.setAttribute('type', 'button');

      listPlayButton.innerHTML = "Play";
      listPlayButton.setAttribute('class', 'playbutton');
      listPlayButton.setAttribute('id', 'playbutton' + data[i].id);
      listPlayButton.setAttribute('type', 'button');
      listPlayButton.setAttribute('onClick',"startGame('" + data[i].id + "')");


      newListTr.setAttribute('id', 'list');
      newListTr.appendChild(listLabel);
      newListTr.appendChild(listEditButton);
      newListTr.appendChild(listDeleteButton);
      newListTr.appendChild(listPlayButton);
      listTr.appendChild(newListTr);
    }
});



function startGame(data){
    window.location.href="/host/" + "?id=" + data[i].id;
    console.log(data);
}
