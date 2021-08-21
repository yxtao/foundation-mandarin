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
      <div className="row">
        <div className="col-sm"> 
             <button  className="btn btn-secondary" onClick={startRecording} disabled={isRecording}> start recording </button>  
        </div>
        <div class="col-sm"> 
             <audio src={audioURL} controls />
        </div>
        <div class="col-sm" > 
            <button  className="btn btn-secondary" onClick={stopRecording} disabled={!isRecording}> stop recording </button>
        </div>
        <div class="col-sm">
        
         <button className="btn btn-success" 
                 disabled={audioURL ==="" || blobObj===null} 
                 onClick={()=>{props.callbackAudio(blobObj, audioURL);setBlobObj(null); setAudioURL(null);}}>
                 upload
         </button> 
        </div> 
      </div> 
    </div>
  )
}


export default Audio 