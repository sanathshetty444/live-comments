import { all, fork } from "redux-saga/effects";
import { homeSaga } from "./home/saga";

export default function* rootSaga() {
    yield all([fork(homeSaga)]);
}
