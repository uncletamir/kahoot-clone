var socket = io();
var url = window.location.search;
var splitUrl = url.split('=');
console.log(splitUrl[0]);
console.log(splitUrl[1]);
var params = splitUrl[1];
console.log(params);


socket.on('connect', function(){
  socket.emit('requestlisthistorykata', params);


});
jQuery(document).ready(function(){


  socket.on ('responlisthistorykata', function(data){

    var index = 0;
    var liatdata = data[0].history;
    // console.log(liatdata);
    // console.log(data[0].history[0].name);
    // console.log(data[0].history[0].gameData.score);

    for( var i = 0; i < Object.keys(liatdata).length; i++){

      var listTr = document.getElementById('listsoal');
      var newListTr = document.createElement("tr");
      var listnama = document.getElementById('idhost');
      var listdate = document.getElementById('date');
      var listindex = document.createElement("td");
      var listnama_player = document.createElement("td");
      var listscore_player = document.createElement("td");

      listnama.innerHTML = "ID Game :" + "" + data[0].idhost;
      listnama.setAttribute('id','idhost');
      listdate.innerHTML = "Create At :" + "" + data[0].timestamps;
      listdate.setAttribute('id','date');

      listindex.innerHTML = index += 1;
      // console.log(index - 1);

      listnama_player.innerHTML = liatdata[i].name;
      listscore_player.innerHTML = liatdata[i].gameData.score;

      newListTr.setAttribute('id','list');
      newListTr.appendChild(listindex);
      newListTr.appendChild(listnama_player);
      newListTr.appendChild(listscore_player);
      listTr.appendChild(newListTr);



    };
    });
  });
