import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosclient from './utils/axios'


export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, {rejectWithValue}) => {
        try{
            const response = await axiosclient.post('/user/register', userData)
            return response.data.user
        }
        catch (error){
            return rejectWithValue(error)
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials , {rejectWithValue} ) => {
        try{
            const response = await axiosclient.post('/user/login', credentials)
            return response.data.user
        }
        catch(error){
            return rejectWithValue(error)
        }
    }
)

export const checkUser = createAsyncThunk(
    'auth/check',
    async (_, {rejectWithValue} )=>{
        try{
            const response = await axiosclient.get('/user/check')
            return response.data.user
        }
        catch(error){
            return rejectWithValue(error)
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, {rejectWithValue} )=>{
        try{
            await axiosclient.post('/user/logout')
            return null
        }catch(error){
            return rejectWithValue(error)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState:{
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
    },
    reducers:{
    },
    extraReducers: (builder) =>{

        builder
        //check user register cases
        .addCase(registerUser.pending, (state)=>{
            state.loading = true,
            state.error = null
        })

        .addCase(registerUser.fulfilled, (state,action)=>{
            state.loading = false,
            state.isAuthenticated = !!action.payload,
            state.user = action.payload
        })

        .addCase(registerUser.rejected ,(state,action)=>{
            state.loading = false,
            state.error = action.payload?.message || 'somthing went wrong',
            state.isAuthenticated = false,
            state.user = null
        })

        //check user login cases
        .addCase(loginUser.pending, (state)=>{
            state.loading = true,
            state.error = null
        })

        .addCase(loginUser.fulfilled, (state,action)=>{
            state.loading = false,
            state.isAuthenticated = !!action.payload,
            state.user = action.payload
        })

        .addCase(loginUser.rejected ,(state,action)=>{
            state.loading = false,
            state.error = action.payload?.message || 'somthing went wrong',
            state.isAuthenticated = false,
            state.user = null
        })

        //check auth cases
        .addCase(checkUser.pending, (state)=>{
            state.loading = true,
            state.error = null
        })

        .addCase(checkUser.fulfilled, (state,action)=>{
            state.loading = false,
            state.isAuthenticated = !!action.payload,
            state.user = action.payload
        })

        .addCase(checkUser.rejected ,(state,action)=>{
            state.loading = false,
            state.error = action.payload?.message || 'somthing went wrong',
            state.isAuthenticated = false,
            state.user = null
        })

        //check logut cases
        .addCase(logoutUser.pending, (state)=>{
            state.loading = true,
            state.error = null
        })

        .addCase(logoutUser.fulfilled, (state,action)=>{
            state.loading = false,
            state.user = action.payload,
            state.isAuthenticated = !!action.payload
        })

        .addCase(logoutUser.rejected ,(state,action)=>{
            state.loading = false,
            state.error = action.payload?.message || 'somthing went wrong',
            state.isAuthenticated = false,
            state.user = null
        })
    }
})

export default authSlice.reducer