import React from 'react';
import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TweetList from './TweetList';
import TweetItem from './TweetItem';
import tweetFunctions from './TweetFunctions';

configure({adapter: new Adapter()});

describe('<TweetList/>', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<TweetList/>);
    });

    it('should render no <TweetList/> component', () => {
        expect(wrapper.find(<TweetList/>)).toHaveLength(0);
    });

    it('should render 1 <TweetList/> component', () => {
        let props = {user:' bob', tweetList:[], index: 0, key: 0};
        let wrapper2 = shallow(<TweetItem {...props}/>);
        expect(wrapper2.find(<TweetList />)).toHaveLength(1);
    });
});

test('returnArrFromString: expect array of length 2 to be returned from string input', () => {
    expect(tweetFunctions.returnArrFromString('xxxx.xxxx','.')).toHaveLength(2)
}); 

test('sortTweets: expect an exact array of sorted tweets to be returned', () => {
    let testTweets = 'Ross> Testing...1,2,3.\nBob> Hi, Im new here!';
    expect(tweetFunctions.sortTweets(testTweets)).toStrictEqual([{'user':'Ross', 'tweet':'Testing...1,2,3.'}, {'user':'Bob', 'tweet':'Hi, Im new here!'}])
});

test('getUsersFromText: expect an array system users to be returned', () => {
    let testUsers = 'Ross follows Jim\nBob follows Mark';
    expect(tweetFunctions.getUsersFromText(testUsers)).toStrictEqual([{'user':'Bob', 'follows':['Mark']}, {'user':'Jim', 'follows': []}, {'user':'Mark', 'follows': []}, {'user':'Ross', 'follows': ['Jim']}])
});

test('getUsersFromText: expect an array with a length of 7 to be returned', () => {
    let testUsers = "Ross follows Jim\n   Bob follows Mark  \n\n Ross follows Anthony, James, Alex";
    expect(tweetFunctions.getUsersFromText(testUsers)).toHaveLength(7);
});