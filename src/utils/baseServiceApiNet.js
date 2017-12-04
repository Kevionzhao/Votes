import {
  AppRegistry,
  AsyncStorage,
  Alert
} from 'react-native';
import errorMapping from '../config/errorMapping';
const baseUserURL = "http://ai-gogo.s1.natapp.cc/user";
const baseVoteURL = "http://ai-gogo.s1.natapp.cc/vote";
const _token = "";//"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVuSWQiOiI0ZGI1Y2ExNS0xZWM4LTQ1ZGEtYjhjMi0wYTY4NGM5NzI1NjciLCJzdGFmZklkIjoidXNlciIsImlhdCI6MTUwOTUyNDAwNn0.7jxFXDqY0wCXgvrLREn928AIQgqrmEG0G_HadbZVq1s";

function checkResponsStatus(response){
  console.info(response)
  if(response.hasOwnProperty('errorCode')){
    return {'error':errorMapping.getMsgAsRepsCode(response.errorCode)}
  }else if(response.hasOwnProperty('errorMsg')){
    return {'error':response.errorMsg};
  }else if(response.hasOwnProperty('_token')){
    AsyncStorage.setItem("_token", response._token, function (error) {
      if (error) {
        console.info('存储失败');
      } else {
        console.info('存储成功');
      }
    })
    _token = getToken();
    return {'success':response};
  
  }else{
    return {'success':response};
  }
}
function getToken(){
  AsyncStorage.getItem("_token", function (error, result) {
    if (!error) {
      _token = "Bearer "+result;
    }
  })
  return _token;
} 
function fetchAction(...props) {
  this.url = props.shift(1);
  this.options = props.shift(1);
  console.info(url);
  console.info(Object.assign({}, this.options));
  return fetch(this.url, Object.assign({}, this.options))
  .then((response) => response.json())
  .then(checkResponsStatus)
  .then((data)=>data)
}
export default {
  getUserInfo(formData) {
    var apiPort = "authorize";
    console.info(`${baseUserURL}/${apiPort}`);
    return fetchAction(`${baseUserURL}/${apiPort}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization':getToken()
      },
     body: JSON.stringify(formData)
    });
  },
  sentPublicVote(voteId,formData) {
    var apiPort = `votes/${voteId}`;
    return fetchAction(`${baseVoteURL}/${apiPort}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':getToken()
      },
      body: JSON.stringify(formData)
    });
  },
  getVoteList() {
    var apiPort = "votes";
    return fetchAction(`${baseVoteURL}/${apiPort}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':getToken()
      }
    });
  },
  getVoteListDetails(voteId) {
    //populate=items&voter=true
    var apiPort = `votes/${voteId}`;
    return fetchAction(`${baseVoteURL}/${apiPort}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':getToken()
      }
    });
  },
  submitVote(formData) {
    var apiPort = `votes/${formData.voteId}`;
    return fetchAction(`${baseVoteURL}/${apiPort}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':getToken()
      },
      body: JSON.stringify(formData)
    });
  },
  releaseVote(data) {
    var apiPort = 'votes';
    return fetchAction(`${baseVoteURL}/${apiPort}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':_token
      },
      body: JSON.stringify(data)
    });
  },
};