import { AUTH,
    LOGOUT
} from '../constants/actionType';

export default (state = {authData : null}, action) => {
    switch (action.type) {
        case AUTH:
            sessionStorage.setItem('profile',JSON.stringify({...action?.data}));
            // localStorage.setItem('profile',JSON.stringify({...action?.data}))
            return {...state, authData: action?.data};
        case LOGOUT:
            sessionStorage.clear();
            return {...state, authData:null};
       default:
            return state;
    }
}