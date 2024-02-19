// import React, {useRef, useEffect, useState} from "react";

// function App() {
//   const videoRef = useRef(null);
//   const photoRef = useRef(null);
//   const [hasPhoto, setHasPhoto] = useState(false);

//   const getVideo = () => {
//     navigator.mediaDevices.getUserMedia({video: { width: 1920, height: 1080 } })

//     .then(stream => {
//       let video = videoRef.current;
//       video.srcObject = stream;
//       video.play();
//     })
//     .catch(err => {
//       console.error(err);
//     })
//   }

//   useEffect(() => {
//     getVideo();
//   }, [videoRef]);


//   return (
//     <div className="App">
//       <div className="camera">
//         <video ref={videoRef}>
//           <button>SNAP!</button>
//         </video>
//       </div>
//       <div className={'result' + (hasPhoto ? 'hasPhoto' : '')}>
//         <canvas ref={photoRef}></canvas>
//         <button>Close</button>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useRef, useEffect, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(document.createElement("canvas"));
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isRotten, setIsRotten] = useState(false);
  const [fruitAge, setFruitAge] = useState(null);

  useEffect(() => {
    photoRef.current.width = 640; // Adjust as needed
    photoRef.current.height = 480; // Adjust as needed
  }, []);

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;

        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  const takePhoto = () => {
    let video = videoRef.current;
    const context = photoRef.current.getContext("2d");

    if (!context) {
      console.error('Canvas context is null or undefined. Try again.');
      return;
    }

    if (video.readyState >= 2) {
      photoRef.current.width = video.videoWidth;
      photoRef.current.height = video.videoHeight;

      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      setHasPhoto(true);

      const { isRotten, age } = analyzeFruit(photoRef.current);
      setIsRotten(isRotten);
      setFruitAge(age);
    } else {
      console.log('Video is not ready yet. Try again.');
    }
  };

  const analyzeFruit = (capturedCanvas) => {
    const referenceImage = new Image();
    referenceImage.src = "freshTomato.jpg"; // Provide a reference image

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = referenceImage.width;
    canvas.height = referenceImage.height;

    context.drawImage(referenceImage, 0, 0);

    const fruitRegion = getFruitRegion(capturedCanvas);
    const capturedImageData = capturedImageToImageData(fruitRegion);
    const referenceImageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    const freshnessThreshold = 20;
    const { isRotten, colorDifferenceSum, totalPixels } = calculateColorDifference(capturedImageData, referenceImageData);

    const averageColorDifference = colorDifferenceSum / totalPixels;
    const age = estimateFruitAge(averageColorDifference);

    return { isRotten, age };
  };

  const calculateColorDifference = (capturedImageData, referenceImageData) => {
    const totalPixels = capturedImageData.length / 4;
    let colorDifferenceSum = 0;

    for (let i = 0; i < capturedImageData.length; i += 4) {
      const capturedPixel = [capturedImageData[i], capturedImageData[i + 1], capturedImageData[i + 2]];
      const referencePixel = [referenceImageData[i], referenceImageData[i + 1], referenceImageData[i + 2]];

      colorDifferenceSum += calculateColorDifferenceBetweenPixels(capturedPixel, referencePixel);
    }

    return { isRotten: colorDifferenceSum > freshnessThreshold, colorDifferenceSum, totalPixels };
  };

  const calculateColorDifferenceBetweenPixels = (pixel1, pixel2) => {
    return Math.sqrt(
      Math.pow(pixel1[0] - pixel2[0], 2) +
      Math.pow(pixel1[1] - pixel2[1], 2) +
      Math.pow(pixel1[2] - pixel2[2], 2)
    );
  };

  const estimateFruitAge = (averageColorDifference) => {
    // A simple estimation based on color difference
    // You may need more sophisticated methods for accurate age estimation
    return Math.round(averageColorDifference * 10); // Adjust as needed
  };

  const getFruitRegion = (capturedCanvas) => {
    // Implement logic to identify the fruit region within the captured image
    // This can involve image processing techniques like edge detection, segmentation, etc.
    // For simplicity, assuming the whole image is the fruit region in this example.
    return capturedCanvas;
  };

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div className="App">
      <div className="camera">
        <video ref={videoRef}></video>
        <button onClick={takePhoto}>SNAP!</button>
      </div>
      <div className={`result ${hasPhoto ? 'hasPhoto' : ''}`}>
        {hasPhoto && (
          <div>
            <p>{isRotten ? "Rotten Fruit!" : "Fresh Fruit!"}</p>
            <p>{fruitAge !== null ? `Estimated Age: ${fruitAge} days` : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;



