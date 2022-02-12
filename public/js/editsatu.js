var socket = io();
// var params = jQuery.deparam(splitUrl[0]);
// console.log(params);
var url = window.location.search;
// var index = url.substring(url.lastIndexOf('/')+1);
// console.log(index);
var splitUrl = url.split('/');
console.log(splitUrl[0]);
console.log(splitUrl[1]);
var index = splitUrl[1];
var spliturl2 = splitUrl[0].split("?id=");
var params = spliturl2[1];
// jQuery.deparam(splitUrl[0]);
console.log(params);
console.log(index);
socket.on('connect', function(data){
  socket.emit('requestlistsatu', {
    id:params,
    index: index
  });
});

jQuery(document).ready(function(){


  socket.on ('responlistsatu', function(data){

    console.log(data);
    console.log(data.ka);
    console.log(data.kb);
    console.log(data.per);
    console.log(data.pemb);
    var nosoal = document.getElementById('no');
    var kasoal = document.getElementById('acak');
    var kbsoal = document.getElementById('benar');
    var persoal = document.getElementById('per');
    var pembsoal = document.getElementById('pemb');

    kasoal.value = data.ka;
    kbsoal.value = data.kb;
    persoal.value = data.per;
    pembsoal.value = data.pemb;
    });
  });

  function updateDatabase(){
      // var questions = [];
      // var name = document.getElementById('name').value;
      // console.log(name);

          var question = document.getElementById('acak').value;
          var correct = document.getElementById('benar').value;
          var pertanyaan = document.getElementById('per').value;
          var pembahasan = document.getElementById('pemb').value;

          // questions.push({"id":id,"question": question,"pertanyaan": pertanyaan, "correct": correct, 'pembahasan': pembahasan})



      var quiz = {
        id: params,
        index:index,
        question: question,
        pertanyaan: pertanyaan,
        correct: correct,
        pembahasan: pembahasan

    };
      socket.emit('updateSatuSoal', quiz);
      window.history.back();
  }

function startGame(data) {
    window.location.href="../../host/" + "?id=" + oid;

}

function editPage(data) {
console.log(data);
    window.location.href="../../editpage/" + "?id=" + data;

}

function tambahSoal () {
  window.location.href="../uploadsoal";
}
