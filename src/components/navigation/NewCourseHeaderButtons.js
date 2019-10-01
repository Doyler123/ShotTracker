import React from 'react'
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentHole } from '../../redux/slices/newCourseSlice' 


export default NewCourseHeaderButtons = (props) => {

    const dispatch = useDispatch()
    const { currentHole } = useSelector(state => state.newCourse)

    const IoniconsHeaderButton = (props) => (
        <HeaderButton {...props} IconComponent={Ionicons} iconSize={23} color="blue" />
    )

    const onPressNextHole = (nextHole) => {
        dispatch(setCurrentHole({
            currentHole : nextHole
        }))
    }

    const getNextHoleLabel = () => {
        if(currentHole === 0){
            return "Next"
        }

        return "Hole " + (currentHole + 1) + " >"
    }

    return(
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <HeaderButtons.Item 
            title={getNextHoleLabel()} 
            onPress={() => {onPressNextHole(currentHole + 1)}} />
        </HeaderButtons>
    )
}