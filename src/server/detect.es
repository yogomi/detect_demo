import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { exec as processExec } from 'child_process'

const router = express.Router();

const upload = multer({ dest: './public/tmp' });
let processingFilePaths = [];

router.get(
  '/detected-image',
  (req, res) => {
    fs.stat(`./public/tmp/${req.query.filename}`, (err, fileStats) => {
      if (err) {
        res.json({
          result: 'ok',
          file_exist: false
        });
      } else {
        res.json({
          result: 'ok',
          file_exist: fileStats.isFile()
        });
      }
    })
  }
);

router.post(
  '/upload-file',
  upload.single('pictureFile'),
  (req, res) => {
    const conf_file = 'python_src/configs/COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml'
    let options = 'MODEL.WEIGHTS detectron2://COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x/137849600/model_final_f10217.pkl';
    options = `${options} MODEL.DEVICE cpu`;
    options = `${options} MODEL.ROI_HEADS.SCORE_THRESH_TEST ${req.body.scoreThreshTest}`;
    options = `${options} TEST.DETECTIONS_PER_IMAGE ${req.body.detectionsPerImage}`;
    console.log(options);
    let command = 'python3 python_src/demo.py';
    command = `${command} --config-file ${conf_file}`;
    command = `${command} --input ${req.file.path}`;
    command = `${command} --output ${req.file.path}_detected.jpg`;
    command = `${command} --opts ${options}`
    processingFilePaths.push(req.file.path);
    processExec(command, (err, stdout, stderr) => {
      if (err) {
        console.log('detect error');
        if (processingFilePaths.indexOf(req.file.path) !== -1) {
          processingFilePaths.splice(processingFilePaths.indexOf(req.file.path), 1);
        }
        fs.writeFileSync(`${req.file.path}_error.txt`, stderr, 'utf-8');
      } else {
        console.log('detect success');
        if (processingFilePaths.indexOf(req.file.path) !== -1) {
          processingFilePaths.splice(processingFilePaths.indexOf(req.file.path), 1);
        }
      }
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });

    res.json({
      result: 'ok',
      processingFilename: req.file.filename,
      processingFilePath: req.file.path
    });
  },
);

export default router;
