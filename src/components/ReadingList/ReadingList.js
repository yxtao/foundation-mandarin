import React, {useEffect, useState} from'react';
import { useRecoilState } from "recoil";
import { storyPagestate } from '../../store/storyWordsAtoms';
import DisplayReading from './DisplayReading/DisplayReading';

import './ReadingList.css'

const ReadingList = (props)=>{
    const [stories, setStories] = useState(props.stories);
    const [storiesBackUp,setStoriesBackUp] = useState(props.stories);
    const [target, setTarget] = useState("");
    const [storyPageArrays, setStoryPageArrays] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [pageNumState, setPageNumState] = useRecoilState(storyPagestate);
    const [currentPage, setCurrentPage] = useState(pageNumState);
    const [error,setError] = useState("");
    const [creators, setCreators] = useState([]);
    const [selectedCreators,setSelectedCreators] = useState([]);
    const [checkedCreatorsStates, setCheckedCreatorsStates] = useState([]);
    const  tags= ["Biographies",
        "Creatures",
        "Nature",
        "Myths and Legends",
        "Me and my life",
        "Poetry",
        "Feelings",
        "Science and math",
        "Friends and family",
        "Fun and funny",
        "Seasons",
        "World cultures",
        "Social studies",
        "Holidays and celebrations",
        ]; // TODO update it base on db data
    const [selectedTags,setSelectedTags] = useState([]);
    const [checkedTagsStates, setCheckedTagsStates] = useState([]);


    useEffect(()=>{  
        let temp = [];
        storiesBackUp.forEach((e)=>{
            if(!temp.includes(e.creator)){
                temp.push(e.creator);
            }
        })
        setCreators(temp);   
    },[])

    useEffect(()=>{
        setCheckedCreatorsStates( new Array(creators.length).fill(false)); 
    },[creators.length])

    useEffect(()=>{
        setCheckedTagsStates( new Array(tags.length).fill(false)); 
    },[tags.length])
    
    useEffect(()=>{
        let storiesCopy = [...storiesBackUp];
        if(selectedCreators.length!==0){
            const result = storiesCopy.filter((story)=>selectedCreators.includes(story.creator));
            setStories(result);
            setCurrentPage(0);
            setRowsPerPage(8);     
        }else{
           setStories(storiesBackUp);
        } 
      },[selectedCreators,storiesBackUp])

      useEffect(()=>{
        let storiesCopy = [...storiesBackUp];
        if(selectedTags.length!==0){
            // TODO tags should be an array in db
            const result = storiesCopy.filter((story)=> 
                                                        (story.tags && story.tags.some(tag=>selectedTags.includes(tag)))
                                             );
            setStories(result);
            setCurrentPage(0);
            setRowsPerPage(8);
        }else{
           setStories(storiesBackUp);
        } 
      },[selectedTags,storiesBackUp])

    const handleOnSelectedCreatorsChange = (position) => {
        setPageNumState(0);
        const updatedCheckedStates = checkedCreatorsStates.map((item, index) =>index === position ? !item : item);
        setCheckedCreatorsStates(updatedCheckedStates);
        let selected = [];
        updatedCheckedStates.forEach((value,index)=>{
            if(value===true){
                selected.push(creators[index]);
            }
        })
        setSelectedCreators(selected);
    }  
    const handleOnSelectedTagsChange = (position) => {
        setPageNumState(0);
        const updatedCheckedStates = checkedTagsStates.map((item, index) =>index === position ? !item : item);
        setCheckedTagsStates(updatedCheckedStates);
        let selected = [];
        updatedCheckedStates.forEach((value,index)=>{
            if(value===true){
                selected.push(tags[index]);
            }
        })
        setSelectedTags(selected);
    }  

    const handleTargetChange= (e)=>{
        if(e.target.value===""){
            setStories(props.stories);
        }
        setTarget(e.target.value.trim());
    }
    const onSearch = ()=>{
        let storiesCopy = [...stories];
        if(target !== ""){
            const result = storiesCopy.filter((s)=>s.name.includes(target));
            setStories(result);
        }else{
            setStories(props.stories);
        } 
    }
    const onClearFilter =()=>{
        setCheckedTagsStates( new Array(tags.length).fill(false));  
        setCheckedCreatorsStates( new Array(creators.length).fill(false)); 
        setSelectedCreators([]);
        setSelectedTags([]);
    }
    
    return (
        <div className="readingListMain">
            <div className="row">
                <div className="col-sm-2">
                    <div className="col-xs-2 active-cyan">
                        <input 
                            className="form-control" 
                            type="text" 
                            placeholder="keywords"
                            value = {target}
                            onChange ={(e)=>handleTargetChange(e)}
                        /> {error}   
                    <div className=" pt-1 active-cyan">
                        <button className="btn btn-outline-info" onClick={onSearch}>  search </button>
                    </div>
                    </div>
                </div>   
                <div className="col-sm-3">
                    by usernames
                    <div className="stories-checkbox-div">
                        <ul>
                        {checkedCreatorsStates.length>0 && 
                            creators.sort((a,b)=> a.toLowerCase().localeCompare(b.toLowerCase()))
                                 .map((name, index)=>
                                <li key={index} >
                                    <div> 
                                    <input 
                                        type="checkbox"
                                        id={`custom-checkbox-story-creator${index}`}
                                        name={name}
                                        value={name}
                                        checked={checkedCreatorsStates[index]}
                                        onChange={() => handleOnSelectedCreatorsChange(index)}
                                    />
                                    &nbsp;
                                    <label htmlFor={`custom-checkbox-story-creator${index}`}>{name}</label>
                                    </div> 
                                </li>
                            )}
                        </ul>
                    </div>
                </div> 
                <div className="col-sm-4">
                    by topics
                    <div className="stories-checkbox-div">
                        <ul>
                        {checkedTagsStates.length>0 && tags.sort().map((name, index)=>
                                <li key={index}>
                                    <div > 
                                    <input 
                                        type="checkbox"
                                        id={`custom-checkbox-story-tag${index}`}
                                        name={name}
                                        value={name}
                                        checked={checkedTagsStates[index]}
                                        onChange={() => handleOnSelectedTagsChange(index)}
                                    />
                                    &nbsp;
                                    <label htmlFor={`custom-checkbox-story-tag${index}`}>{name}</label>
                                    </div> 
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="col-sm-2 ">
                    <button className="btn btn-sm btn-outline-primary" onClick={onClearFilter}>  clear filter </button>
                </div> 
            </div>
           <DisplayReading 
           stories = {stories}/>
    </div>        
    )
}

export default ReadingList