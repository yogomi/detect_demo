import express from 'express';

const router = express.Router();

router.get(
  '/upload-file',
  (req, res) => {
    console.log('aaaa');
    res.json({
      result: 'ok',
    });
  },
);

export default router;
