var socket = io();


socket.on('connect', function(){
    socket.emit('requesthistorykata');//Get database names to display to user
});


socket.on('responhistorykata', function(data){
  // console.log(data.idhost);
  // console.log(data.timestamps);
  var index = 0;
    for(var i = 0; i < Object.keys(data).length; i++){

      var listTr = document.getElementById('listku');
      var newListTr = document.createElement("tr");
      var listindex = document.createElement("td");
      var listoid = document.createElement("td");
      var listNo = document.createElement("td");
      var listLabel = document.createElement("td");
      var listDate = document.createElement("td");
      var listShowButton = document.createElement("td");



      listindex.innerHTML = index += 1;
      listLabel.innerHTML = data[i].idhost;
      console.log(data[i].idhost);
      listDate.innerHTML = data[i].timestamps;
      console.log(data[i].timestamps);
      listoid.setAttribute('class', 'list');
      listoid.setAttribute('id', 'oid' + data[i]._id);
      listoid.setAttribute('type', 'text');

      listShowButton.innerHTML = "Show";
      listShowButton.setAttribute('class', 'showbutton');
      listShowButton.setAttribute('id', 'showbutton' + data[i].idhost);
      listShowButton.setAttribute('class', 'btn btn-rounded btn-warning');
      listShowButton.setAttribute('onClick',"showhistory('"+ data[i].idhost +"')");


      newListTr.setAttribute('id', 'list');
      newListTr.appendChild(listindex);
      newListTr.appendChild(listLabel);
      newListTr.appendChild(listDate);
      newListTr.appendChild(listShowButton);
      listTr.appendChild(newListTr);

    };
});


function showhistory(data) {
    window.location.href="../../showhistorykata/" + "?id=" + data;
    console.log(editmodul);

}
