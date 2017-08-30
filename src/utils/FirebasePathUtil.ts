import {dataToJS, getFirebase} from 'react-redux-firebase'

function getUId(firebase) {
    return firebase.auth().currentUser && firebase.auth().currentUser.uid;
}

export const config = firebase => `config/${getUId(firebase)}`;
