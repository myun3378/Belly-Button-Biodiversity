function buildMetadata(sample) {

  output.html(" ");
  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`;
   
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then(function(response) {
    const data = response;
    d3.select("#sample-metadata").html("");
    Object.entries(data).forEach(([key,value]) =>  d3.select("#sample-metadata").append("li").text(`${key} : ${value}`));
  });

  // Use `.html("") to clear any existing metadata


  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

//     // BONUS: Build the Gauge Chart
//     // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
    
    var response = [response];
    var data = response[0];

    var sample_values = data['sample_values'];
    var otu_ids = data['otu_ids'];
    var otu_labels = data['otu_labels'];

    // @TODO: Build a Bubble Chart using the sample data
    var trace0 = {
      x : otu_ids,
      y : sample_values,
      type: 'scatter',
      mode : 'markers',
      marker :{
        size: sample_values,
        color: otu_ids,
        colorscale: "Viridis"
      },
      text : otu_labels
    };

    var data0 = [trace0];

    var layout = {
      xaxis: {title: "OTU ID"}
    };
    
    Plotly.newPlot("bubble", data0, layout);
    

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).  

    data['sample_values'].sort((first, second) => second - first);
    
    var sample_values2 = data['sample_values'].slice(0,10);
    
    var trace1 = {
      labels: otu_ids,
      values: sample_values2,
      text: otu_labels,
      type: "pie"
    };

    var data1 = [trace1];

    Plotly.newPlot("pie",data1);
    
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
