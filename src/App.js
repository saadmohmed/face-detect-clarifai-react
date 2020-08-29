import React from 'react';
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '837acdfe2cf24864b50037451edcce8c',
});
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      imageUrl: '',
      input: '',
      box: {},
    };
  }
  faceLocation = (data) => {
    const face_data = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(face_data);
    const image = document.getElementById('image');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: face_data.left_col * width,
      topRow: face_data.top_row * height,
      rightCol: width - face_data.right_col * width,
      bottomRow: height - face_data.bottom_row * height,
    };
  };
  displayFace = (box) => {
    console.log(box);
    this.setState({
      box: box,
    });
  };
  onInputChange = (event) => {
    this.setState({
      input: event.target.value,
    });
  };

  onButtonClicked = () => {
    this.setState({
      imageUrl: this.state.input,
    });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => this.displayFace(this.faceLocation(response)))
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <div className='App'>
        <div className='ma5 to'>
          <div className='center'>
            <div className='form center pa4 br3 shadow-5'>
              <input
                type='text'
                className='f4 pa2 w-70 center'
                onChange={this.onInputChange}
              />
              <button
                className='w-30 grow f4 link ph3 pv2 dib white bg-blue'
                onClick={this.onButtonClicked}>
                Detect
              </button>
            </div>
          </div>
        </div>
        <br />
        <br />

        <div className='center ma'>
          <div className='absolute mt2'>
            <img
              alt=''
              id='image'
              style={{ width: '500px', height: 'auto' }}
              src={this.state.input}
            />
            <div
              className='bounding-box'
              style={{
                top: this.state.box.topRow,
                right: this.state.box.rightCol,
                bottom: this.state.box.bottomRow,
                left: this.state.box.leftCol,
              }}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
