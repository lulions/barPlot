var input_tag = document.createElement("INPUT");
input_tag.setAttribute("type","file");
input_tag.setAttribute("id","input-file");
document.body.appendChild(input_tag);


document.getElementById('input-file')
  .addEventListener('change', getFile)

  

function getFile(event) {
  const input = event.target
  if ('files' in input && input.files.length > 0) {
        placeFileContent(input.files[0]);
        
  }
}

function placeFileContent(file) {
	readFileContent(file).then(content => {
    
    var results = Papa.parse(content,{
        header: true
    });
    //alert(JSON.stringify());
var mydata = results['data'];

alert(JSON.stringify(results))
    var ratio_res = 1.75;
var h_svg = 500;
var w_svg = h_svg*ratio_res;
var vert_marg = 0.025;
var bar_to_space = 0.75;
var color_bar = "blue";

var n = mydata.length;
var m_svg = w_svg*vert_marg;
var w_bar = (w_svg-(m_svg*2))/n;
var w_bar_filled = w_bar*bar_to_space;
var w_bar_notfilled = w_bar*(1-bar_to_space);
var values = mydata.map(function(x) {return x.value});
var minDataPoint = d3.min(values);
var maxDataPoint = d3.max(values);

var h_scale = d3.scaleLinear().domain([0,maxDataPoint]).range([0,h_svg-(m_svg*2)]);
for (var i = 0; i < n; i++) {
	mydata[i].value = h_scale(mydata[i].value);
}


var svg = d3.select("#chart")
			.append("svg")
			.attr("width", w_svg)
			.attr("height", h_svg)
			//.style("border", "1px solid black");

var rects = svg	
			.selectAll("rect")
			.data(mydata)
			.enter()
			.append("rect")
			.attr("x", function(d,i) { return m_svg  + (i*w_bar) + (w_bar_notfilled/2)})
			.attr("y", function(d){ return h_svg-d.value-m_svg })
			.attr("width", w_bar_filled)
			.attr("height", function(d){ return d.value })
			.style("fill", color_bar)
			.style("fill-opacity",0.3)
			.style("stroke", color_bar)
			.style("stroke-width", "1.5px");

var labels = svg
			  .selectAll("text")
			  .data(mydata)
			  .enter()
			  .append("text")
			  .attr("x", function(d,i) { return m_svg  + (i*w_bar) + (w_bar_notfilled/2) + (w_bar_filled/2)})
			  .attr("y", h_svg-5)
			  //.style("text-align","right")
			  //.style("text-anchor", "middle")
			  //.style("font-family","sans-serif")
			  //.style("font-size","20px")
			  //.style("font-weight","bold")
			  .attr("display", "inline-block")
			  .attr("transform", "translate(-300,-150) rotate(270deg)")
			  .attr("text-overflow", "fade")
              .text(function(d,i) { return d.axis })
              

  }).catch(error => console.log(error))
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

