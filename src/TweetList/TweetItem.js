import React from 'react';
import './TweetItem.css'

const tweetItem = (props) => {

    return(
        <div key={'itemkey_'+props.index} className="tweet-item">
            <p id={'userid_'+props.index} key={'userkey_'+props.index}>{props.user}</p>
            {props.tweetList.map((item, index) =>
                <div id={"tweetid_"+props.index+"_"+index} key={"tweetkey_"+props.index+"_"+index} className="tweet">
                    @{item.user}: {item.tweet}
                </div>
            )  
            }    
        </div>
    );
} 

export default tweetItem;