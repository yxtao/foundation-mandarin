import React ,{ useEffect, useState } from 'react';


const Audio = (props)=> { 
  
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [blobObj, setBlobObj] = useState(null);
  useEffect(() => {
    // Lazily obtain recorder first time we're recording. 
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }

    // Manage recorder state.
    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = e => {
      setAudioURL(URL.createObjectURL(e.data));
      setBlobObj(e.data)
    };

    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };


async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream);
}

  return (
    <div className="container">
      <audio src={audioURL} controls />
      {audioURL}
      <button onClick={startRecording} disabled={isRecording}>
        start recording
      </button>
      <button  onClick={stopRecording} disabled={!isRecording}>
        stop recording 
      </button>
      {audioURL !=="" ?
      <button onClick={()=>props.callbackAudio(blobObj)}>save </button> :null}
    </div>
  );
}


export default Audio 