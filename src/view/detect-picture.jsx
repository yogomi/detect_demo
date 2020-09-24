import React from 'react';

export default class DetectPicture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreviewUrl: null,
      detectedFileUrl: null
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

  executeDetect(targetFileObject) {
    const url = 'api/v1/detect/upload-file';

    // enctype="multipart/form-data" でデータを送信するためにFormDataにファイルを設定する
    const uploadData = new FormData();
    uploadData.append('pictureFile', targetFileObject);
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
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
    }

    this.onUploadFileChange = this.onUploadFileChange.bind(this);
    this.onSubmitUploadFile = this.onSubmitUploadFile.bind(this);
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
    const { uploadFile } = this.state;

    this.props.executeDetect(uploadFile);
  }

  render() {
    return (
        <form onSubmit={this.onSubmitUploadFile}>
          <input
            type='file'
            accept='image/png, image/jpeg'
            onChange={this.onUploadFileChange}
          />
          <input
            className='button'
            type='submit'
            value='Upload'
          />
        </form>
    );
  }
}
