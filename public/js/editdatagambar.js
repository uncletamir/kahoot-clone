var socket = io();
var params = jQuery.deparam(window.location.search);
console.log(params);


socket.on('connect', function(){
  socket.emit('requestlistmodulgambar', params);


});
jQuery(document).ready(function(){


  socket.on ('responlistmodulgambar', function(data){
    // console.log(data);
    var index = 0;
    var oid = data[0]._id;
    var liatdata = data[0].questions;
    ;
    for( var i = 0; i < Object.keys(liatdata).length; i++){

      var listTr = document.getElementById('listsoal');
      var newListTr = document.createElement("tr");

      var listnama = document.getElementById('nama');
      var listindex = document.createElement("td");
      var listka = document.createElement("td");
      var listkb = document.createElement("td");
      var listper = document.createElement("td");
      var listpemb = document.createElement("td");
      var listEditButton = document.createElement("td");
      var listDeleteButton = document.createElement("td");
      var buttontambahsoal = document.getElementById('tambahsoal')

      listnama.innerHTML = "Nama Modul :" + "" + data[0].name;
      listnama.setAttribute('id','nama');


      listindex.innerHTML = index += 1;
      console.log(index - 1);

      listka.innerHTML = '<img src="../data/' + liatdata[i].question + '" class="user-avatar-xl"/>';
      listkb.innerHTML = liatdata[i].correct;
      listper.innerHTML = liatdata[i].pertanyaan;
      listpemb.innerHTML = liatdata[i].pembahasan;

      listka.setAttribute('class','user-avatar-xl');

      listEditButton.innerHTML = "Edit";
      listEditButton.setAttribute('class', 'editbutton');
      listEditButton.setAttribute('id', 'editbutton');
      listEditButton.setAttribute('class', 'btn btn-rounded btn-warning');
      console.log(oid);
      listEditButton.setAttribute('onClick',"editPage('"+data[0].id+"/"+(index -1 )+" ')");
      // listEditButton.setAttribute('onClick',"editPage()");

      listDeleteButton.innerHTML = "Delete";
      listDeleteButton.setAttribute('class', 'deletebutton');
      // listDeleteButton.setAttribute('id', 'deletebutton' + data[i].id);
      listDeleteButton.setAttribute('class', 'btn btn-rounded btn-danger');
      listDeleteButton.setAttribute('onClick',"deletesatusoal('"+data[0].id+"/"+(index-1)+"')");

      buttontambahsoal.setAttribute('onClick', "tambahSoal('"+data[0].id+"/"+(index-1)+"')");

      newListTr.setAttribute('id','list');
      newListTr.appendChild(listindex);
      newListTr.appendChild(listka);
      newListTr.appendChild(listkb);
      newListTr.appendChild(listper);
      newListTr.appendChild(listpemb);
      newListTr.appendChild(listEditButton);
      newListTr.appendChild(listDeleteButton);
      listTr.appendChild(newListTr);



    };
    });
  });

function startGame(data) {
    window.location.href="../../host/" + "?id=" + oid;

}

function editPage(data) {
console.log(data);
    window.location.href="../../editpagegambar/" + "?id=" + data;

}


function deletesatusoal(data){
  socket.emit('deletesatusoal',data);
  window.location.reload();
}

function tambahSoal (data) {
  window.location.href="../uploadsatusoalgambar/" + "?id=" + data;
}
