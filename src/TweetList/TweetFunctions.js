//assumption made is that every tweets and users text file is only well formed if each line is separated by a new line char (\n)
const sortTweets = (tweets) => {
    let tweetsArr = [];
    let eachTweet = '';
    eachTweet = tweets.split('\n');

    eachTweet.forEach(element => {
        let tweetArr = element.split(">");
        //make sure it's a well-formed tweet(has a user AND a tweet)
        if(tweetArr.length === 2) {
            if(tweetArr[0].trim() !== '' && tweetArr[1].trim() !== '') {
                tweetsArr.push({'user': tweetArr[0].trim(), 'tweet': tweetArr[1].trim()});
            }    
        }  
    });

    return tweetsArr;
}

//processes entire user.txt file 
//assumption made is that there is only one person who FOLLOWS on each line, possibly multiple people that they follow (ie: a one to many relationship)
//another assumption made is that every name mentioned in the array is needed in order to figure out who the users in the system as a whole are (based off of the expected output in requirements doc)
const getUsersFromText = (users) => {
    //general array to hold all users and is what is returned
    let usersArr = [];
    //separate all the users lines into their own objects in an array
    let eachLine = users.split('\n');
    //remove any empty items that were possibly added by user error ie: new line char with no actual value following it
    eachLine = eachLine.filter(v=>v!=='');

    let tempArrUser = [];
    let tempArrFollows = [];
    
    eachLine.forEach(element => {
        //ensure that there is an actual value and not a blank line that a user might have put in by mui
        
        //create an array using 'follows' as delimeter
        tempArrUser = returnArrFromString(element, "follows");

        //check the file is well-formed, with the line having at least one user following another 
        if(tempArrUser.length === 2) {
            if(tempArrUser[0].trim() !== '' && tempArrUser[1].trim() !== '') {
                //then check if there are multiple users being followed using the ',' delimiter
                //because it's assumed it's a one to many relationship, the item at position 1 in the array is always the people that the user is following
                tempArrFollows = returnArrFromString(tempArrUser[1],',');

                //replace the raw comma delimited string in the array with the properly formatted followers item generated above
                tempArrUser.splice(1,1);
                Array.prototype.push.apply(tempArrUser, tempArrFollows);  
                let tempUsersArr = [...usersArr];
                //now we figure out if the name(user or one of the people they follow) exists in the user list, so that we can see every user that possibly exists in the system and add them if theyre missing
                usersArr = processUserList(tempArrUser, tempUsersArr, tempArrFollows);
            }
        }    
    }); 
    
    //once we have a nice user list, sort it alphabetically
    usersArr.sort(sortByUser);

    return usersArr;
}

//this function takes any array of plain user names, the current list of users, and an array of users that are being followed, and transforms these inputs into an array of UNIQUE users with the people they follow
//assumption made here is that the first user in the usernameArr is always the user that is following the others in followsArr
const processUserList = (usernameArr, userdataArr, followsArr) => {
    let userListArr = [];
    userListArr = [...userdataArr];

    usernameArr.forEach((element, index) => {
        let tempName = element.trim(); 	
        let userExists = false;
        let userExistsIndex = 0;

        if(userListArr.length !== 0) {
            userdataArr.forEach((elem, ind) => {
                //check if user already exists in usersArr
                if(elem.user === tempName) {
                    userExists = true;
                    userExistsIndex = ind;
                }
            });

            //if user exists and the index is 0, just replace whomever they follow as this must be an update of the user(s) they follow
            if(userExists && index === 0) {
                userListArr[userExistsIndex].follows = followsArr;
            }
            else if(!userExists && index === 0) {
                userListArr.push({"user": tempName, "follows":followsArr});
            }
            else if(!userExists && index !== 0) {
                userListArr.push({"user": tempName, "follows":[]});
            }
        }    
        else {
            //initialise the object array - it will be the first item in tempUser, so it will be a user with a follows array.
            userListArr.push({"user": tempName, "follows":followsArr});
        }
        
    });

    return userListArr;
}

const returnArrFromString = (arr, delim) => {
    return arr.split(delim).map(function(item) {
        return item.trim();
    })
}

const sortByUser = (x, y) => {
    return ((x.user === y.user) ? 0 : ((x.user > y.user) ? 1 : -1 ));
}

export default {sortTweets, getUsersFromText, returnArrFromString}