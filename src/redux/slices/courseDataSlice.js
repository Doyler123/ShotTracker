import { createSlice } from 'redux-starter-kit'

const courseDataSlice = createSlice({
    slice : 'courseData',
    initialState : {
        currentHole : 0,
        courses : {
            test : {
                id : 'test',
                name : 'Luttrellstown Castle Golf Club'
            }
        }
    },
    reducers : {
        addCourse(state, action){
            const { course } = action.payload
            state[course.id] = course
        }
    }
})

export const { addCourse } = courseDataSlice.actions

export default courseDataSlice.reducer