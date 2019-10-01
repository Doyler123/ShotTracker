import React from 'react';
import MapHoles from './src/components/course/MapHoles'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux'
import store from './src/redux/store/store'
import Courses from './src/components/course/Courses'
import CourseDetails from './src/components/course/CourseDetails'


const AppNavigator = createStackNavigator({
  Courses : Courses,
  CourseDetails : CourseDetails,
  MapHoles : MapHoles
},
{
  initialRouteName: 'Courses'
}
);

const AppContainer = createAppContainer(AppNavigator);

export default App = () =>  {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>)
}