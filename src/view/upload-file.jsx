import React from 'react';

export default class UploadFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadFile: null,
      imagePreviewUrl: null
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

  async onSubmitUploadFile(event) {
    event.preventDefault();

    const url = 'api/v1/detect/upload-file';

    // enctype="multipart/form-data" でデータを送信するためにFormDataにファイルを設定する
    const uploadData = new FormData();
    const { uploadFile } = this.state;
    uploadData.append('pictureFile', uploadFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(uploadFile);


    // // サーバにPOSTする
    // const response = await fetch(
    //   url,
    //   {
    //     method: 'POST',
    //     body: uploadData,
    //     credentials: 'include',
    //   },
    // );
    // const result = await response.json();
    // if (result.result === 'ok') {
    //   // 追加に成功したら一覧画面に戻る
    //   console.log('aaaafff');
    // }
  }

  render() {
    return (
      <div>
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
        <img src={this.state.imagePreviewUrl} />
      </div>
    );
  }
}
