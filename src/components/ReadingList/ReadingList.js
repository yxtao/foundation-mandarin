import './ReadingList.css'

import { useHistory } from 'react-router-dom';

const ReadingList = (props)=>{
    const history = useHistory();
   
    const openStory = (name) => {
       history.push(`/story/${name}`);
       console.log(props.stories)
    }
    return (<div className="ReadingListDiv">
               <div>
                   reading list 
                  { props.stories.map((story, index)=> <button key={index} onClick={()=>openStory(story.name)}>{story.name} </button>)}
               </div>
          </div>        
    )}

export default ReadingList