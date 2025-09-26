import { put, all, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import auditoryService from "./service";

import {
  GETEVENTS_INIT,
  GETEVENTS_SUCCESS,
  GETEVENTS_FAILURE,
} from "./actionTypes";

export function* getAuditoryEvents() {
  try {
    const auditoryEventsPayload = yield call(auditoryService.getAuditoryEvents);

    if (auditoryEventsPayload.length === 0) {
      yield all([call(toast.info, "No hay resultados")]);
    }

    yield put({
      type: GETEVENTS_SUCCESS,
      payload: auditoryEventsPayload,
    });
  } catch (err) {
    console.log(err);
    yield all([
      put({
        type: GETEVENTS_FAILURE,
        errors: { ...err.response.data.errors },
      }),
      call(toast.error, "Hubo un error :("),
    ]);
  }
}

export default function* rootAuditory() {
  yield all([takeLatest(GETEVENTS_INIT, getAuditoryEvents)]);
}
