import React, {useEffect, useState} from 'react';
import "./Teacher.css"
import firebase from '../../firebase/firebase';

const db = firebase.firestore();
const storage = firebase.storage();

const Teacher=()=>{
   const [name, setName] = useState("");
   const [content, setContent] = useState("");
   const [file, setFile] = useState(null);

   const onNameChange = (e)=>{
       setName(e.target.value)
   }

   const onContentChange =(e)=>{
       setContent(e.target.value)
   }
   const onFileChange =(e)=>{
       setFile(e.target.files[0])
   }

   const onStoryCreate = async ()=>{
       if (!name || !content) return

       await db.collection("story").doc(name).set({
           name : name,
           content: content,
       })
       if (file!==null) {
        const storageRef = storage.ref()
        const fileRef = storageRef.child(`story/${name}`)
        await fileRef.put(file, {contentType:'image/jpeg'})
        await db.collection("story").doc(name).update({
           image: firebase.firestore.FieldValue.arrayUnion({
               url: await fileRef.getDownloadURL()
           })
        })
       }
       
       setName("");
       setContent("");
       setFile(null)
   }
    return (
       <div className="ContainerMain">
           <input value={name} onChange={onNameChange} type="text" />
           <input value={content} onChange={onContentChange} type="text" />
           <input  onChange={onFileChange} type="file" />
           <button onClick={onStoryCreate}>Create story </button>     
       </div>
    )
}

export default Teacher;