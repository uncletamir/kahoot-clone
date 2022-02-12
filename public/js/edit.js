var socket = io();
var params = jQuery.deparam(window.location.search);

socket.on('connect', function(){
    socket.emit('cariData');//Get database names to display to user
});

socket.on('datapertanyaan', function(data){
  document.getElementById('question').innerHTML = data.q1;
  console.log(data.q1);
  document.getElementById('pertanyaan').innerHTML = data.p1;
  document.getElementById('pembahasan').innerHTML = data.pembahasan;


});

//Called when user wants to exit quiz creator
function cancelEdit(){
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "../datasoal";
    }
}
