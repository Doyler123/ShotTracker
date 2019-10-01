import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Content, List, ListItem, Text, Left, Right, Icon } from 'native-base';
import { useSelector } from 'react-redux'


function HomeScreen(props) {

    const { courses } = useSelector(state => state.courseData)

    const [ready, setReady] = useState(false)
  
    useEffect(()=>{
      async function loadFonts(){
        await Font.loadAsync({
          Roboto: require('../../../node_modules/native-base/Fonts/Roboto.ttf'),
          Roboto_medium: require('../../../node_modules/native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
        });
        setReady(true)
      }
  
      loadFonts()
    })
    
    if(!ready){
      return <AppLoading />;
    }
    
    return (
        <Content>
          <List>
              {Object.keys(courses).map(courseID => {
                  const course = courses[courseID]
                return (
                    <ListItem
                        key={course.id} 
                        onPress={() => props.navigation.navigate('MapHoles',  {id : course.id, title : course.name})}>
                        <Left>
                            <Text>{course.name}</Text>
                        </Left>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </ListItem>)}
                )}
                <ListItem
                    onPress={() => props.navigation.navigate('MapHoles', {id : 'newCourse', title : "New Course"})}>
                    <Left>
                        <Text>{"New Course"}</Text>
                    </Left>
                    <Right>
                        <Icon name="add" />
                    </Right>
                </ListItem>
          </List>
        </Content>
    )
    
}

HomeScreen.navigationOptions = ({ navigation }) => ({
    title: 'Courses',
});

export default HomeScreen