// This is the entry for the client-side code. Include all requires here.

var count = 0;
document.getElementById("logo").addEventListener("click", function() {
  document.getElementById("title").innerText = count++;
});
