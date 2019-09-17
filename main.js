let video;
const knnClassifier = ml5.KNNClassifier(); // Create a KNN classifiers
let featureExtractor;

function setup() {
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  noCanvas();
  video = createCapture(VIDEO);
  video.size(360, 240);
  video.parent('videoContainer');

  // Create the UI buttons
  createButtons();
}

function modelReady(){
  select('#status').html('You can find the objects placed next to the screen')
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  knnClassifier.classify(features, gotResults);

}

// A util function to create UI buttons
function createButtons() {

  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Load saved classifier dataset
  buttonSetData = select('#load');
  buttonSetData.mousePressed(loadMyKNN);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      select('#result').html(result.label);
      select('#confidence').html(`${confidences[result.label] * 100} %`);

      if (result.label == 'Thor'){
        let thorText = 'In Germanic mythology, Thor is a hammer-wielding god associated with thunder, lightning, storms, oak trees, strength, the protection of mankind and also hallowing and fertility.'
        document.getElementById("result-header").innerHTML = 'The Mighty Thor';
        document.getElementById("result-text").innerHTML = thorText;
      } else if (result.label == 'Loki'){
        const lokiText = 'Loki (Old Norse: [ˈloki], Modern Icelandic: [ˈlɔːkɪ], often Anglicized as /ˈloʊki/) is a god in Norse mythology. Loki is in some sources the son of Fárbauti and Laufey, and the brother of Helblindi and Býleistr.'
        document.getElementById("result-header").innerHTML = "The Treacherous Loki ";
        document.getElementById("result-text").innerHTML = lokiText;
      } else if (result.label == 'Odin'){
        let odinText = 'In Norse mythology, Odin (Old Norse: Óðinn) is the god of wisdom, poetry, death, divination and magic. Son of Bor and the giantess (jötunn) Bestla, Odin is the chief of the Æsir and the king of Asgard. He is married to the goddess Frigg, and is the father of the gods Thor, Baldr, Höðr, Víðarr and Vál'
        document.getElementById("result-header").innerHTML = "Odin Allfather";
        document.getElementById("result-text").innerHTML = odinText;
      }

    }

    select('#confidenceRock').html(`${confidences['Thor'] ? confidences['Thor'] * 100 : 0} %`);
    select('#confidencePaper').html(`${confidences['Loki'] ? confidences['Loki'] * 100 : 0} %`);
    select('#confidenceScissor').html(`${confidences['Odin'] ? confidences['Odin'] * 100 : 0} %`);
  }

  classify();
}

// Update the example count for each label
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();

  select('#exampleRock').html(counts['Thor'] || 0);
  select('#examplePaper').html(counts['Loki'] || 0);
  select('#exampleScissor').html(counts['Odin'] || 0);
}

// Clear the examples in one label
function clearLabel(label) {
  knnClassifier.clearLabel(label);
  updateCounts();
}

// Clear all the examples in all labels
function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}

// Save dataset as myKNNDataset.json
function saveMyKNN() {
  knnClassifier.save('myKNNDataset');
}

// Load dataset to the classifier
function loadMyKNN() {
  knnClassifier.load('./myKNNDataset.json', updateCounts);
}
