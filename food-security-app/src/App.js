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
import "./App.css"; // Import your CSS file if you have one

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;

        video.addEventListener('loadedmetadata', () => {
          video.play();
        });

        video.addEventListener('loadeddata', () => {
          // Video has loaded enough data for the first frame
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  const takePhoto = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    const context = photo.getContext("2d");

    // Check if the video has loaded enough data for the first frame
    if (video.readyState >= 2) { // 2 corresponds to HAVE_CURRENT_DATA
      // Set canvas dimensions to match video dimensions
      photo.width = video.videoWidth;
      photo.height = video.videoHeight;

      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      setHasPhoto(true);
    } else {
      console.log('Video is not ready yet. Try again.');
    }
  };

  const savePhoto = () => {
    let photo = photoRef.current.toDataURL("image/png");
    let link = document.createElement("a");
    link.href = photo;
    link.download = "captured_photo.png";
    link.click();
  };

  const closePhoto = () => {
    setHasPhoto(false);
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
        <canvas ref={photoRef}></canvas>
        {hasPhoto && (
          <div>
            <button className="closeButton" onClick={closePhoto}>Close</button>
            <button className="saveButton" onClick={savePhoto}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
