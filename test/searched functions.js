
// TIMEPARSER
var data = { 'Video':'','Time':'','Emotion':'','Answer':'','RT':'','Intensity':'','TimeStamp':'06.05.16-19:55:19'};
console.log(data.TimeStamp)

var parser = d3.time.format("%d.%m.%Y-%H:%M:%S")

var time = parser.parse(data.TimeStamp)

console.log(time)

// SRC SELECTOR
document.getElementById('video').src = "https://www.youtube.com/embed/q0foi4k8AUY?enablejsapi=1"
$('iframe').attr('src', "https://www.youtube.com/embed/q0foi4k8AUY?enablejsapi=1")

