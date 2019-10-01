import { combineReducers } from 'redux-starter-kit'
import courseDataReducer from '../slices/courseDataSlice'
import newCourseReducer from '../slices/newCourseSlice'

const rootReducer = combineReducers({
    courseData : courseDataReducer,
    newCourse : newCourseReducer
})

export default rootReducer