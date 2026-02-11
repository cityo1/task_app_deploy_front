import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  POST_TASK_API_URL,
  GET_TASKS_API_URL,
  UPDATE_COMPLETED_TASK_API_URL,
  DELETE_TASK_API_URL,
  PUT_TASK_API_URL,
} from '../../utils/apiUrls';

import {
  postRequest,
  getRequest,
  patchRequest,
  deleteRequest,
  putRequest,
} from '../../utils/requests';

/* ====== Common Fetch Thunk Function ====== */

const postItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (postData) => {
    // console.log(postData);
    const options = {
      body: JSON.stringify(postData),
    };
    return await postRequest(apiURL, options);
  });
};

const getItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (userId) => {
    const fullPath = `${apiURL}/${userId}`;
    return await getRequest(fullPath);
  });
};

const updateCompletedFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (options) => {
    return await patchRequest(apiURL, options);
  });
};

const deleteItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (itemId) => {
    const options = {
      method: 'DELETE',
    };
    const fullPath = `${apiURL}/${itemId}`;
    return await deleteRequest(fullPath, options);
  });
};

const putTaskFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (updateData) => {
    // console.log(defaultOptions);
    const options = {
      body: JSON.stringify(updateData),
    };
    return await putRequest(apiURL, options);
  });
};

/* ====== Data Fetch Actions ====== */

// Get Item Data Fetch
export const fetchGetItem = getItemFetchThunk(
  'fetchGetItem',
  GET_TASKS_API_URL
);

// Post Item Data Fetch
export const fetchPostItem = postItemFetchThunk(
  'fetchPostItem',
  POST_TASK_API_URL
);

// Patch Completed Data Fetch
export const fetchUpdateCompleted = updateCompletedFetchThunk(
  'fetchUpdateCompleted',
  UPDATE_COMPLETED_TASK_API_URL
);

// Delete Item Data Fetch
export const fetchDeleteItem = deleteItemFetchThunk(
  'fetchDeleteItem',
  DELETE_TASK_API_URL
);

// Put Task Data Fetch
export const fetchPutTask = putTaskFetchThunk('fetchPutTask', PUT_TASK_API_URL);

/* ====== Handle Fulfilled and Rejected Functions ====== */

const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload;
};

const handleRejected = (action) => {
  console.log('Error: ', action.payload);
};

/* ====== API Slice ====== */

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    postItemData: null,
    getItemData: null,
    updateCompletedData: null,
    deleteItemData: null,
    putTaskData: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostItem.fulfilled, handleFulfilled('postItemData'))
      .addCase(fetchPostItem.rejected, handleRejected)

      .addCase(fetchGetItem.fulfilled, handleFulfilled('getItemData'))
      .addCase(fetchGetItem.rejected, handleRejected)

      .addCase(
        fetchUpdateCompleted.fulfilled,
        handleFulfilled('updateCompletedData')
      )
      .addCase(fetchUpdateCompleted.rejected, handleRejected)

      .addCase(fetchDeleteItem.fulfilled, handleFulfilled('deleteItemData'))
      .addCase(fetchDeleteItem.rejected, handleRejected)

      .addCase(fetchPutTask.fulfilled, handleFulfilled('putTaskData'))
      .addCase(fetchPutTask.rejected, handleRejected);
  },
});

export default apiSlice.reducer;
