import { createSlice } from 'redux-starter-kit'

const newCourseSlice = createSlice({
    slice : 'newCourse',
    initialState : {
        currentHole : 0,
        courseData : {
            id : "",
            name : "",
            courseLocation : {},
            holes : {}
        }
    },
    reducers : {
        setID(state, action){
            const { id } = action.payload
            state.courseData.id = id
        },
        setName(state, action){
            const { name } = action.payload
            state.courseData.name = name
        },
        setCourseLocation(state, action){
            const { location } = action.payload
            state.courseData.courseLocation = location
        },
        addHoleInfo(state, action){
            const { name, data } = action.payload
            if(state.courseData.holes[state.currentHole]){
                state.courseData.holes[state.currentHole][name] = data
            }else{
                state.courseData.holes[state.currentHole] = {
                    [name] : data
                }
            }
        },
        setCurrentHole(state, action){
            let { currentHole } = action.payload
            
            if(!Number.isInteger(currentHole)){
                currentHole = parseInt(currentHole)
            }
            state.currentHole = currentHole
        }
    }
})

export const { setID, setName, addHoleInfo, setCurrentHole, setCourseLocation } = newCourseSlice.actions

export default newCourseSlice.reducer