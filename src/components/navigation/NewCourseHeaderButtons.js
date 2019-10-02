import React from 'react'
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentHole } from '../../redux/slices/newCourseSlice'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Constants from '../../conatants/Constants'


export default NewCourseHeaderButtons = ({ goToHole }) => {

    const { showActionSheetWithOptions } = useActionSheet();
    const dispatch = useDispatch()
    const { currentHole } = useSelector(state => state.newCourse)
    const { holes } = useSelector(state => state.newCourse.courseData)

    const IoniconsHeaderButton = (props) => (
        <HeaderButton {...props} IconComponent={Ionicons} iconSize={23} color="blue" />
    )

    const onPressNextHole = (nextHole) => {
        dispatch(setCurrentHole({
            currentHole : nextHole
        }))
    }

    const onPressHole = (holeNumber) => {
        dispatch(setCurrentHole({
            currentHole : holeNumber
        }))
        goToHole(
            holes[holeNumber][Constants.TEE_MARKER],
            holes[holeNumber][Constants.FAIRWAY_MARKER],
            holes[holeNumber][Constants.GREEN_MARKER]
        )
    }

    const getNextHoleLabel = () => {
        if(currentHole === 0){
            return "Next"
        }

        return "Hole " + (currentHole + 1) + " >"
    }

    const onOpenActionSheet = ({ hiddenButtons }) => {
        let options = hiddenButtons.map(it => it.props.title);
        let destructiveButtonIndex = 1;

        showActionSheetWithOptions(
            {
              options,
              destructiveButtonIndex,
            },
            buttonIndex => {
              hiddenButtons[buttonIndex].props.onPress();
            }
          );

    }

    const getOverFlowIcon = () => {
        if(Object.keys(holes).length > 0){
            return <Ionicons name="md-list" size={32} color="blue" />
        }
        return null
    }

    return(
        <HeaderButtons 
            HeaderButtonComponent={IoniconsHeaderButton} 
            OverflowIcon={getOverFlowIcon()}
            onOverflowMenuPress={onOpenActionSheet}
        >
            <HeaderButtons.Item 
                title={getNextHoleLabel()} 
                onPress={() => {onPressNextHole(currentHole + 1)}} />
                {Object.keys(holes).map(holeNumber => (
                    <Item title={"Hole " + holeNumber} show="never" onPress={() => onPressHole(holeNumber)} />
                ))}
        </HeaderButtons>
    )
}