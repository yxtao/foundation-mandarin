import React ,{useState, useEffect} from 'react';
import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue } from "recoil";
import {usernameState,
        firebaseState,
        userIdState,
        isTeacherState,
        likedWordList,
        likedStoryList} from "../../store/AuthAtoms"
import {storyliststate, wordliststate,} from "../../store/storyWordsAtoms";
import "./TeacherDashboard.css";

const TeacherDashboard = ()=>{
    const history = useHistory();
    const isTeacher = useRecoilValue(isTeacherState);
    const firebase = useRecoilValue(firebaseState);
    const [user, setUser] = useRecoilState(usernameState);
    const [userId, setUserId] = useRecoilState(userIdState);
    const [likedWords, setLikedWords] = useRecoilState(likedWordList);
    const [likedStories, setLikedStories] = useRecoilState(likedStoryList);
    const [storyList, setStoryList] = useRecoilState(storyliststate);
    const [wordList, setWordList] = useRecoilState(wordliststate);
    const [likedWordObjs, setLikedWordObjs] = useState([]);
    const [likedStoryObjs, setLikedStoryObjs] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [selectedStories, setSelectedStories] = useState([]);
    const [myWords, setMywords] = useState([]);
    const [myStories,setMyStories] = useState([]);
    const [checkedStates, setCheckedStates] = useState([]);
    const [error,setError] = useState("");
    const [code,setCode] = useState("");
    
    useEffect(()=>{
        let wordObjsTemp = [];
        wordList.forEach((wordObj, index)=>{
            console.log("wordData", wordObj);
            if(likedWords.includes(wordObj.wordId)){     
               let wordInfo = wordObj;
                wordObjsTemp.push(wordInfo);
            }   
        })    
        setLikedWordObjs(wordObjsTemp);
    },[wordList, likedWords])

   useEffect(()=>{
      setMywords(wordList.filter((word)=>word.creator===user));
   }, [wordList,user])

    useEffect(()=>{  
        setCheckedStates( new Array(myWords.length).fill(false));
    },[myWords.length])

    useEffect(()=>{
        let objsTemp = [];
            storyList.forEach((storyObj, index)=>{
            console.log("storyData", storyObj);
            console.log("likedstories", likedStories);
            if(likedStories.includes(storyObj.storyId)){     
               let storyInfo = storyObj;
                objsTemp.push(storyInfo);
            }   
        })
        setLikedStoryObjs(objsTemp);
    }, [storyList, likedStories])

    const handleOnChange = (position) => {
        const updatedCheckedStates = checkedStates.map((item, index) =>index === position ? !item : item);
        setCheckedStates(updatedCheckedStates);
        let selected = [];
        updatedCheckedStates.forEach((value,index)=>{
            if(value===true){
                selected.push(myWords[index]);
            }
            console.log(selected)
        })
        console.log("before", selectedWords);
       setSelectedWords(selected);
       console.log("after", selectedWords);
    }

    const handleRemoveLike = async (wordId) =>{
        let words = [...likedWords];
            words= words.filter(word=> word!==wordId);
        try {
            await updatelikedWordCards(userId, words);
        }catch(err){
            setError(err.message)
        }
        setLikedWords(words);
     }
     const updatelikedWordCards = async(uid, words)=>{
        try {
            const docRef = firebase.firestore().collection("users").doc(uid);
            const doc = await docRef.get(); 
            if(!doc.exists) { 
                 setError("NOT FOUND"); 
                 return;
             }
            await docRef.update({
                likedWordCards:words
            })
          }catch(err){    
            setError(err.message);
          }
      }

    const addToWordDB = async (word) =>{
        // WARNING: wordList is updated once firebase snapshot works
        try {
            let wordObj = {
                ...word,
                creator: user,
                wordId:user+word.name}
            await handleRemoveLike(word.wordId); 
            await firebase.firestore().collection("chinesewords").doc(user+word.name).set(wordObj)    
          }catch(err){    
            setError(err.message);
          }
    }
  
    const addToStoryDB = async (story) =>{
        // WARNING: storyList is updated once firebase snapshot works
        try {
            let storyObj = {
                ...story,
                creator: user,
                storyId:user+story.name}
            await handleRemoveStoryLike(story.storyId); 
            await firebase.firestore().collection("story").doc(user+story.name).set(storyObj)    
          }catch(err){    
            setError(err.message);
          }
    }
    const handleRemoveStoryLike = async (storyId) =>{
        let stories = [...likedStories];
            stories= stories.filter(story=> story!==storyId);
        try {
            await updatelikedStories(userId, stories);
        }catch(err){
            setError(err.message)
        }
        setLikedStories(stories);
     }
     const updatelikedStories = async(uid, stories)=>{
        try {
            const docRef = firebase.firestore().collection("users").doc(uid);
            const doc = await docRef.get(); 
            if(!doc.exists) { 
                 setError("NOT FOUND"); 
                 return;
             }
            await docRef.update({
                likedPassages:stories
            })
          }catch(err){    
            setError(err.message);
          }
      }
    
    const redirtToDetailWord = (wordId)=>{
      history.push(`/carddetail/${wordId}`)
    }
    const redirtToStory = (id)=>{
       history.push(`/story/${id}`)
    }
    const redirectToAddStory = ()=>{
        history.push("/addStory");
    }
    const redirectToAddWord = ()=>{
        history.push("/addWord");
    }
    const redirectToWordwall = ()=>{
        history.push("/wordwall")
    }
    const redirecToStoryList = ()=>{
        history.push("/reading")
    }
    const redirectToMyStoryList = ()=>{
        history.push("/myreading");
    }
    const redirectToLikedStoryList = ()=>{
        history.push("/likedReading")
    }
    const redirectToOwnerList = () =>{
        history.push("/myWordwall");
    }
    const redirectToLikedList = () =>{
        history.push("/likedWordwall");
    }
    const generateAccessCode =()=>{
        setCode(user+storyList.length+wordList.length);
        //TODO update user accesscode in accesscode collection
    }
   
    if(!isTeacher) {
        return (<div className = "container-wrapper">
           Please sign in as a teacher
        </div>)
        }
    return (
        <div className="container-wrapper">
            {error}
            <div className="flex-div">
                    <div className = "flex-item p-2">
                        <button 
                            className="btn btn-outline-info"
                            onClick = {redirectToOwnerList}> 
                                My word list 
                         </button>
                         <ul>
                        {myWords.map((word, index)=>
                        <li className = "words-div">
                             <div  key={index}  className="p-2 flex-row">  
                             <input 
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                name={word.wordId}
                                value={word.wordId}
                                checked={checkedStates[index]}
                                onChange={() => handleOnChange(index)}
                            />
                             <button        
                                 type="button" 
                                 className="btn btn-outline-light" 
                                 onClick={()=>redirtToDetailWord(word.wordId) }>    
                                 <span class="h4 text-success">  {word.name}</span>
                             </button>
                            </div> 
                        </li>)}
                        </ul>
                    </div>
                    <div className = "flex-item p-2">
                        <button
                            className="btn btn-outline-info"
                            onClick = {redirectToMyStoryList}>  
                            My passage list </button>
                        {storyList.map((story, index)=> story.creator === user?
                        <div className = "words-div">
                             <div  key={index}  className="p-2 flex-row">  
                             <button        
                                 type="button" 
                                 className="btn btn-outline-light" 
                                 onClick={()=>redirtToStory (story.storyId) }>    
                                 <span class="h4 text-success">  {story.name}</span>
                             </button>
                            </div> 
                        </div>  : null )}
                    </div>
                    <div className="flex-item p-5">
                        <button className="btn btn-outline-info m-2" onClick={redirectToAddWord}>  Add words </button>
                        <button className="btn btn-outline-info m-2 " onClick={redirectToAddStory}>  Add passages </button>
                        <button className="btn btn-outline-info m-2" onClick= {redirectToWordwall}> all words </button>
                        <button className="btn btn-outline-info m-2" onClick={redirecToStoryList}> all passages </button>
                    </div>
                </div>
            <div className = "flex-div">
                <div className = "flex-item p-3">
                    <button className="btn btn-outline-info m-2" onClick={generateAccessCode}> assign access code</button>
                    {selectedWords.map((word)=><span>{word.name +" "} </span>)}
                    <div className="p-3 m-3 text-danger">  {code} </div>
                    <div className="p-3"> {code?"copy paste this code and share it with your students ":""}</div>
                </div>
                <div className = "flex-item p-2">
                        <button 
                            className="btn btn-outline-info"
                            onClick={redirectToLikedList}> 
                            Liked word list 
                         </button>
                        <div className = "words-div">
                        {likedWordObjs.map((word, index)=>
                            <div  key={index}  className="p-2 flex-column">       
                                <button        
                                    type="button" 
                                    className="btn btn-outline-light" 
                                    onClick={()=>redirtToDetailWord(word.wordId) }>    
                                    <span class="h4 text-success">  {word.name}</span>
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-light"
                                    onClick={()=>addToWordDB(word) }>    
                                    <span class=" text-success"> + add to my word list </span>
                                </button>
                            </div>)}
                        </div>
                    </div>
                    <div className = "flex-item p-2">
                        <button 
                            className="btn btn-outline-info"
                            onClick={redirectToLikedStoryList}>  Liked passage list </button>
                        <div className = "stories-div">
                        {likedStoryObjs.map((story, index)=>
                            <div  key={index}  className="p-2 flex-column">       
                                <button        
                                    type="button" 
                                    className="btn btn-outline-light" 
                                    onClick={()=>redirtToStory(story.storyId) }>    
                                    <span class="h4 text-success">  {story.name}</span>
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-light"
                                    onClick={()=>addToStoryDB(story) }>    
                                    <span class=" text-success"> + add to my passage list </span>
                                </button>
                            </div>)}
                        </div>
                    </div>
             </div>
        </div>
    )
}

export default TeacherDashboard;