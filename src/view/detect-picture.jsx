import React from 'react';
import DetectTypeSelector from './detect-type-selector';

export default class DetectPicture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreviewUrl: null,
      detectedFileUrl: null,
      detectingMessage: ''
    }

    this.getDetectedImageInterval = null;
    this.detectedFilename = null;
    this.executeDetect= this.executeDetect.bind(this);
    this.getDetectedImage = this.getDetectedImage.bind(this);
  }

  componentWillUnmount() {
    if (this.getDetectedImageInterval) {
      clearInterval(this.getDetectedImageInterval);
    }
  }

  async getDetectedImage() {
    let { detectingMessage } = this.state;
    detectingMessage = `${detectingMessage}🍣`;
    this.setState({detectingMessage});
    if (this.detectedFilename == null) {
      return;
    }
    let url = `api/v1/detect/detected-image?filename=${this.detectedFilename}`;

    // サーバにPOSTする
    const response = await fetch(
      url,
      {
        method: 'GET',
        credentials: 'include',
      },
    )
    const result = await response.json();
    if (result.result === 'ok') {
      // 追加に成功したら一覧画面に戻る
      if (result.file_exist) {
        clearInterval(this.getDetectedImageInterval);
        this.getDetectedImageInterval = null;
        this.setState({
          detectedFileUrl: `detected-images/${this.detectedFilename}`
        });
      }
    } else {
      console.log(result);
    }
  }

  executeDetect(targetFileObject, scoreThreshTest, detectionsPerImage) {
    const url = 'api/v1/detect/upload-file';

    // enctype="multipart/form-data" でデータを送信するためにFormDataにファイルを設定する
    const uploadData = new FormData();
    uploadData.append('pictureFile', targetFileObject);
    uploadData.append('scoreThreshTest', scoreThreshTest);
    uploadData.append('detectionsPerImage', detectionsPerImage);
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
        detectingMessage: 'Detecting ',
        detectedFileUrl: null
      });
    }
    reader.readAsDataURL(targetFileObject);

    // サーバにPOSTする
    fetch(
      url,
      {
        method: 'POST',
        body: uploadData,
        credentials: 'include',
      },
    )
      .then(response => response.json())
      .then(result => {
        if (result.result === 'ok') {
          // 追加に成功したら一覧画面に戻る
          this.detectedFilename = `${result.processingFilename}_detected.jpg`;
          this.setState({
            result: result.result
          });
        } else {
          console.log(result);
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.getDetectedImageInterval = setInterval(this.getDetectedImage, 1000);
  }

  render() {
    let SetUploadForm = () => {
      if (this.getDetectedImageInterval === null) {
        return <UploadForm
          executeDetect={this.executeDetect}
        />
      }
      return <div />
    }
    let ShowDetectingMessage = () => {
      if (this.getDetectedImageInterval !== null) {
        return <p>{this.state.detectingMessage}</p>
      }
      return <div />
    }
    let ShowDetectedImage = () => {
      const { detectedFileUrl } = this.state;
      if (detectedFileUrl !== null) {
        return <img className='detect-image' src={detectedFileUrl} />
      }
      return <div />
    }
    return (
      <div>
        <SetUploadForm />
        <ShowDetectingMessage />
        <ShowDetectedImage />
        <img className='detect-image' src={this.state.imagePreviewUrl} />
        <p>{this.state.result}</p>
      </div>
    )
  }
}

class UploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadFile: null,
      scoreThreshTest: 0.5,
      detectionsPerImage: 100,
      detectType: 'InstanceSegmentation',
    }

    this.detectTypes = [
      'Detection',  // 枠をつけるだけ
      'PascalVOC-Detection',
      'Keypoints',  // ボーンを検出
      'Comporisons',
      'Cityscapes',
      'InstanceSegmentation',  // 初期のやつ
      'LVISv1-InstanceSegmentation',
      'PospanicSegmentation',  // 全部を何かしらに領域分けする
    ];

    this.onUploadFileChange = this.onUploadFileChange.bind(this);
    this.onSubmitUploadFile = this.onSubmitUploadFile.bind(this);
    this.onScoreThreshTestChange = this.onScoreThreshTestChange.bind(this);
    this.onDetectionsPerImageChange = this.onDetectionsPerImageChange.bind(this);
    this.onDetectTypeChange = this.onDetectTypeChange.bind(this);
  }

  onUploadFileChange(event) {
    const { target } = event;
    const [ file ] = target.files;

    this.setState({
      uploadFile: file,
    });
  }

  onSubmitUploadFile(event) {
    event.preventDefault();
    const { uploadFile, scoreThreshTest, detectionsPerImage } = this.state;

    this.props.executeDetect(uploadFile, scoreThreshTest, detectionsPerImage);
  }

  onScoreThreshTestChange(event) {
    this.setState({scoreThreshTest: (event.target.value / 100).toFixed(2)});
  }

  onDetectionsPerImageChange(event) {
    this.setState({detectionsPerImage: event.target.value});
  }

  onDetectTypeChange(event) {
    this.setState({detectType: event.target.value});
  }

  render() {
    console.log(this.state);
    return (
        <form onSubmit={this.onSubmitUploadFile}>
          <input
            type='file'
            accept='image/png, image/jpeg'
            onChange={this.onUploadFileChange}
          />
          <label>
            Score
            <input
              type='number'
              max={100}
              min={0}
              step={1}
              value={(this.state.scoreThreshTest * 100).toFixed()}
              onChange={this.onScoreThreshTestChange}
            />
          </label>
          %
          <label>
            Count
            <input
              type='number'
              min={1}
              value={this.state.detectionsPerImage}
              onChange={this.onDetectionsPerImageChange}
            />
          </label>
          <label>
            Detect Type
            <DetectTypeSelector
              detectTypes={this.detectTypes}
              detectType={this.state.detectType}
              onDetectTypeChange={this.onDetectTypeChange}
            />
          </label>
          <input
            className='button'
            type='submit'
            value='Upload'
          />
        </form>
    );
  }
}
