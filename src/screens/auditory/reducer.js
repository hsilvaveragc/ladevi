import { createSelector } from 'reselect';

import {
  GETEVENTS_INIT,
  GETEVENTS_SUCCESS,
  GETEVENTS_FAILURE,
} from './actionTypes';

const initialState = {
  events: [],
  loading: false,
  errors: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GETEVENTS_INIT:
      return {
        ...state,
        loading: true,
        errors: {},
      };
    case GETEVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        errors: {},
        events: action.payload,
      };
    case GETEVENTS_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    default:
      return state;
  }
}

const getReducer = (state) => state.auditory;

export const getEvents = createSelector(getReducer, (state) => state.events);

export const getErrors = createSelector(getReducer, (state) => state.errors);

export const getLoading = createSelector(getReducer, (state) => state.loading);
