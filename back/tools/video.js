const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const ThumbnailGenerator = require('video-thumbnail-generator').default;
const u = require('util');
const sharp = require('sharp');
const fs = require('fs');
const { randomString } = require('./random');
const unlink = u.promisify(fs.unlink);

const getVideoInfo = (inputPath) => {
  return new Promise((resolve, reject) => {
    return ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
      if (error) {
        return reject(error);
      }

      const { duration, size } = videoInfo.format;

      return resolve({
        size,
        durationInSeconds: Math.floor(duration),
      });
    });
  });
};

const generateThumbnailFromVideo = async (videoPath, defaultPath = 'contents') => {
  const tg = new ThumbnailGenerator({
    sourcePath: process.cwd() + '/' + videoPath,
    thumbnailPath: process.cwd() + '/' + defaultPath,
    size: '512x288',
  });
  const thumb = await tg.generateOneByPercent(1);
  return await convertToJpeg(thumb);
};

const generateGifFromVideo = async (videoPath, defaultPath = 'contents') => {
  const tg = new ThumbnailGenerator({
    sourcePath: process.cwd() + '/' + videoPath,
    thumbnailPath: process.cwd() + '/' + defaultPath,
  });
  const gif = await tg.generateGif({
    fps: 10, //how many frames per second you want in your gif
    scale: 180, //the smaller the number, the smaller the thumbnail
    speedMultiple: 4, //this is 4x speed
    deletePalette: true, //to delete the palettefile that was generated to create the gif once gif is created);
  });
  return path.relative(process.cwd(), gif);
};

const convertToJpeg = async (
  imagePath,
  keepOriginal = false,
  width = 512,
  path = 'contents',
  addpath = true
) => {
  const newName = path + '/' + randomString(32, true) + '.thumb.jpeg';
  const image = await sharp((addpath ? path + '/' : '') + imagePath)
    .resize(width)
    .jpeg({ quality: 70, progressive: true })
    .toFile(newName);
  if (!keepOriginal) unlink(imagePath).catch((e) => e);
  return newName;
};

module.exports = {
  generateGifFromVideo,
  getVideoInfo,
  generateThumbnailFromVideo,
  convertToJpeg,
};
