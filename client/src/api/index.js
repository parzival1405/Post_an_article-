import axios from 'axios';

const API = axios.create({ baseURL:'http://localhost:5000' });
// const url = 'https://mern-course-1405.herokuapp.com/posts';

API.interceptors.request.use((req) => {
    if(sessionStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(sessionStorage.getItem('profile')).token}`;
    }

    return req;
})


export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`)
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (currentId,updatePost) => API.patch(`/posts/${currentId}`, updatePost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (value,id) => API.post(`/posts/${id}/commentPost`,{value})
export const realtimeChat = (value,id) => API.post(`/posts/${id}/realtime`,{value})

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
