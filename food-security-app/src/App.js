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

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const takePhoto = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    const context = photo.getContext("2d");

    context.drawImage(video, 0, 0, 1920, 1080);
    setHasPhoto(true);
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
        <button onClick={closePhoto}>Close</button>
      </div>
    </div>
  );
}

export default App;
