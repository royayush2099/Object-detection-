
"use client";
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { load as cocoSSDload } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

let detectInterval;

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front camera, 'environment' for back camera
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    setIsLoading(true);
    const net = await cocoSSDload();
    setIsLoading(false);

    detectInterval = setInterval(() => {
      runObjectDetection(net)
    }, 10);
  };

  async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      // find detected objects
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.6
      );

      console.log(detectedObjects);

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context);
    }
  }

  const showmyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  const handleCameraSwitch = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  useEffect(() => {
    runCoco();
    showmyVideo();

    return () => {
      if (detectInterval) {
        clearInterval(detectInterval);
      }
    };
  }, []);

  useEffect(() => {
    if (webcamRef.current) {
      webcamRef.current.video.srcObject = null; // Reset the video source
    }
  }, [facingMode]);

  return (
    <div className='mt-8'>
      {isLoading ? (
        <div className='gradient-text'>Loading AI Model</div>
      ) : (
        <div className='relative flex flex-col items-center gradient p-1.5 rounded-md'>
          {/* webcam */}
          <Webcam
            ref={webcamRef}
            className='rounded-md w-full lg:h-[720px]'
            audio={false}
            videoConstraints={{ facingMode }}
          />
          {/* canvas */}
          <canvas ref={canvasRef} className='absolute top-0 left-0 z-99999 w-full lg:h-[720px]' />
          {/* switch camera button */}
          <button
            className='mt-2 p-2 bg-blue-500 text-white rounded'
            onClick={handleCameraSwitch}
          >
            Switch Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
