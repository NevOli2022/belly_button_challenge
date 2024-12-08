// Function to build the metadata panel
function buildMetadata(sample) {
  const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

  d3.json(url).then((data) => {
    console.log("Full metadata:", data.metadata);

    // Filter metadata for the object with the desired sample number
    const metadata = data.metadata;
    const resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    const result = resultArray[0];
    console.log(`Filtered metadata for sample ${sample}:`, result);

    // Select the metadata panel and clear existing content
    const panel = d3.select("#sample-metadata");
    console.log("Clearing existing metadata...");
    panel.html("");

    // Append each key-value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      console.log(`Appending metadata: ${key} = ${value}`);
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to build the charts
function buildCharts(sample) {
  const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

  d3.json(url).then((data) => {
    console.log("Full samples data:", data.samples);

    // Filter samples for the object with the desired sample number
    const samples = data.samples;
    const resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    const result = resultArray[0];
    console.log(`Filtered sample data for sample ${sample}:`, result);

    // Extract data for charts
    const { otu_ids, otu_labels, sample_values } = result;
    console.log("OTU IDs:", otu_ids);
    console.log("OTU Labels:", otu_labels);
    console.log("Sample Values:", sample_values);

    // Bubble Chart
    const bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };

    console.log("Bubble chart data:", bubbleData);
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Bar Chart
    const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    const barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];

    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    console.log("Bar chart data:", barData);
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Initialization function to set up the dashboard
function init() {
  const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

  d3.json(url).then((data) => {
    console.log("Sample Names:", data.names);

    // Populate the dropdown menu
    const dropdown = d3.select("#selDataset");
    data.names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Build initial charts and metadata panel using the first sample
    const firstSample = data.names[0];
    console.log("First Sample:", firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Event listener for dropdown menu changes
function optionChanged(newSample) {
  console.log("New Sample Selected:", newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
