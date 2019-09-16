let video;
const knnClassifier = ml5.KNNClassifier(); // Create a KNN classifiers
let featureExtractor;

function setup() {
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  noCanvas();
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Create the UI buttons
  createButtons();
}

function modelReady(){
  select('#status').html('FeatureExtractor(mobileNet model) Loaded')
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
  buttonA = select('#addClassRock');
  buttonA.mousePressed(function() {
    addExample('Rock');
  });

  buttonB = select('#addClassPaper');
  buttonB.mousePressed(function() {
    addExample('Paper');
  });

  buttonC = select('#addClassScissor');
  buttonC.mousePressed(function() {
    addExample('Scissor');
  });

  // Reset buttons
  resetBtnA = select('#resetRock');
  resetBtnA.mousePressed(function() {
    clearLabel('Rock');
  });

  resetBtnB = select('#resetPaper');
  resetBtnB.mousePressed(function() {
    clearLabel('Paper');
  });

  resetBtnC = select('#resetScissor');
  resetBtnC.mousePressed(function() {
    clearLabel('Scissor');
  });

  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllLabels);

  // Load saved classifier dataset
  buttonSetData = select('#load');
  buttonSetData.mousePressed(loadMyKNN);

  // Get classifier dataset
  buttonGetData = select('#save');
  buttonGetData.mousePressed(saveMyKNN);
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
    }

    select('#confidenceRock').html(`${confidences['Rock'] ? confidences['Rock'] * 100 : 0} %`);
    select('#confidencePaper').html(`${confidences['Paper'] ? confidences['Paper'] * 100 : 0} %`);
    select('#confidenceScissor').html(`${confidences['Scissor'] ? confidences['Scissor'] * 100 : 0} %`);
  }

  classify();
}

// Update the example count for each label
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();

  select('#exampleRock').html(counts['Rock'] || 0);
  select('#examplePaper').html(counts['Paper'] || 0);
  select('#exampleScissor').html(counts['Scissor'] || 0);
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
