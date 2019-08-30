import React, {useEffect, useState}  from 'react';
import TweetItem from './TweetItem';
import tweetFunctions from './TweetFunctions';

const TweetList = () => {
    const [tweets, setTweets] = useState('');
    const [users, setUser] = useState('');
    const [tweetsList, setTweetsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [displayTweetList, setDisplayTweetList] = useState([]);
    const [errorMsg, setErrorMsg] = useState([]);

    useEffect(() => {
        //first grab the data sources (tweet.txt and user.txt), which is located in the public folder 
        getFileContent('/data-source/tweet.txt', setTweets);
        getFileContent('/data-source/user.txt', setUser); 
    }, []);

    //sort tweets string once the object has a value
    useEffect(() => {
        if(tweets!=='') {
            setTweetsList(tweetFunctions.sortTweets(tweets));
        }
    }, [tweets]);
    //sort the user string once the object has a value
    useEffect(() => {
        if(users!=='') {
            setUsersList(tweetFunctions.getUsersFromText(users));
        }
    }, [users]);

    //combine the user list with the tweet list when both objects have a value
    useEffect(() => {
        if(tweetsList.length > 0 && usersList.length > 0) {
            setErrorMsg('');
            setDisplayTweetList(produceTweetList([...tweetsList], [...usersList]));
        }
        //basic error handling if either file isnt well-formed 
        else {
            if(tweetsList.length === 0) {
                setErrorMsg('Please check that the TWEET file is the correct format.');
            }
            else {
                setErrorMsg('Please check that the USER file is the correct format.')
            }
        }
    }, [tweetsList,  usersList]);

    //takes the file to grab and the function to set the corresponding variable
    const getFileContent = (filePath, setVarStateFunc) => {
        fetch(filePath)
        .then((r) => r.text())
        .then(text  => {
            setVarStateFunc(text);
        }) 
    }

    //assign relevant tweets to the relevant users based on who they follow 
    const produceTweetList = (tweets, users) => {
        let tempTweetDisplayList = [];
        
        users.forEach(elemUser => {
            
            console.log(elemUser.user);
            let tempJsonObj = {'user': elemUser.user, 'tweetList': [], 'followsAction': elemUser.follows}
            //grab all the relevant tweets from the users the person follows and assign it to them
            tweets.forEach(elemTweet => {
                let tweeter =  elemTweet.user
        
                //check if user follows the creator of the tweet or is the person who created the tweet
                if(tempJsonObj.followsAction) {
                    if(tempJsonObj.followsAction.includes(tweeter) || tempJsonObj.user === tweeter) {
                        tempJsonObj.tweetList.push(elemTweet);
                        console.log("\t@"+elemTweet.user+": "+elemTweet.tweet);
                    }
                }    
            });

            tempTweetDisplayList.push(tempJsonObj);
        });
        
        return tempTweetDisplayList;
    }
    

    return(
        <div>
            {errorMsg === '' &&
                <div id='tweetList'> 
                    {displayTweetList.map((item, index) => 
                        <TweetItem key={'_TweetItem_'+index} user={item.user} tweetList={item.tweetList} index={index}></TweetItem>
                    )}
                </div>
            }
            {errorMsg !== '' &&
                <div id='errorDiv' className='error'> 
                    <h2>Error</h2>
                    <p>{errorMsg}</p>
                </div>
            }     
        </div>    
    );
}

export default TweetList;