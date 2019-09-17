# Museum Exhibit concept using transfer learning.


Concept code for museum exhibits to show more information about the pieces which are present in the exhibit. The idea is for people to pick up the fake artifacts and place them in a well lit spot so that the information on the page can change based on what objects are placed.

The knn transfer learning works perfectly here as museums have a good consistent control background against which it's easier to detect objects.

## Demo Video

[Link to Youtube video](https://youtu.be/xKa1Vvh38cw)

### How to use this.

#### For content creators
- Go to /training.html and train upto 3 classes(configurable) to identify by placing them and clicking on the button to let the machine know what your object looks like(train the machine).

- Download the trained dataset by clicking on "Save Dataset" Button and make sure you download it to be the same folder as rest of the files.

- Change the content in the /index.html to match the content you want.

- To exhibit open /index and load the data & begin predicting.


### Upcoming updates

- Provision to add a empty class with background images to set a empty state.
- Ability to preload trained data while presenting without having to load it without clicking "Begin predicting".
