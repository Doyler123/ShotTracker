import React, { useState, useEffect, useReducer } from 'react';
import { Text, Button } from 'react-native';
import { Container, Fab, Icon } from 'native-base';
import { computeDestinationPoint } from 'geolib'
import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from 'react-native-maps';
import { getBearing } from '../../util/geoUtil'
import { getLocation } from '../../services/location-service';
import MapInput from '../search/MapInput';
import HeaderButtons from '../navigation/NewCourseHeaderButtons'
import { useSelector, useDispatch } from 'react-redux'
import { setID, setName, addHoleInfo, setCourseLocation } from '../../redux/slices/newCourseSlice'
import shortId from 'shortid'
import Constants from '../../conatants/Constants'   

export default function MapHoles(props) {
  
  const padding = 150

  const dispatch = useDispatch()

  const { currentHole } = useSelector(state => state.newCourse)
  const { courseLocation } = useSelector(state => state.newCourse.courseData)
  const { holes } = useSelector(state  => state.newCourse.courseData ) || {}

  const [map, setMap] = useState()

  useEffect(()=>{
    getLocation().then(
        (data) => {
            dispatch(setCourseLocation({
              location : {
                latitude: data.latitude,
                longitude: data.longitude,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
            }
            }))
        }
    );

    dispatch(setID({
      id : shortId.generate()
    }))

  }, [])

  const getCoordsFromName = (loc) => {
      var region = {
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003
      }
      dispatch(setCourseLocation({  
        location : region
      }))
      map.animateToRegion(region, 0)
  }
  
  const setMarker = (markerName, data) => {
    dispatch(addHoleInfo({
      name : markerName,
      data : data
    }))
  }
  
  // const [greenPolygon, setGreenPolygon] = useState([
  //   computeDestinationPoint(greenMarker, 10, 0),
  //   computeDestinationPoint(greenMarker, 10, 90),
  //   computeDestinationPoint(greenMarker, 10, 180),
  //   computeDestinationPoint(greenMarker, 10, 270),
  // ])
  
  // const [teeMarkerVisable, setTeeMarkerVisable] = useState(false)
  // const [fairwayMarkerVisable, setFairwayMarkerVisable] = useState(false)
  // const [greenMarkerVisable, setGreenMarkerVisable] = useState(false)
  // const [allVisable, setAllVisable] = useState(false)
  
  // const [fabOpen, setFabOpen] = useState(false)
  
  const isMarkerVisable = (markerName) => {
    return currentHole !== 0 && holes[currentHole] && holes[currentHole][markerName]
  }
  
  // const onClickButton = (markerVisable) => {
  //   setTeeMarkerVisable(false)
  //   setFairwayMarkerVisable(false)
  //   setGreenMarkerVisable(false)
  //   markerVisable()
  // }
  
  const onPressMap = (coordinate) => {
    if(currentHole !== 0){
      if(holes[currentHole]){
        if(!holes[currentHole][Constants.TEE_MARKER]){
          setMarker(Constants.TEE_MARKER, coordinate)
        }
        else if(!holes[currentHole][Constants.FAIRWAY_MARKER]){
          setMarker(Constants.FAIRWAY_MARKER, coordinate)
        }
        else if(!holes[currentHole][Constants.GREEN_MARKER]){
          setMarker(Constants.GREEN_MARKER, coordinate)
        }
      }else{
        setMarker(Constants.TEE_MARKER, coordinate)
      }
    }
  }

  const goToHole = (teeMarker, fairwayMarker, greenMarker) => {
    var bearing = getBearing(teeMarker.latitude, teeMarker.longitude, greenMarker.latitude, greenMarker.longitude)
    setTimeout(()=>{
      map.fitToCoordinates([teeMarker, fairwayMarker, greenMarker],
         { edgePadding: { top: padding, right: padding, bottom: padding, left: padding }, animated: false })
      map.setCamera({heading : bearing})   
    }, 200)

  }

  const onSetMapRef = (ref) => {
    setMap(ref)
    if(!props.navigation.getParam('goToHole')){
      props.navigation.setParams({goToHole : goToHole})
    }
  }

  const onDragPolygon = (point, coordinate) => {
    setGreenPolygon( prevPolygon => prevPolygon.map(p => {
      if(p === point){
        return coordinate
      }
      return p
    }))
  }

  return (
      <Container>
          <MapView
            ref={(ref) => onSetMapRef(ref)}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            // onLayout={()=>{fit()}}
            // initialRegion={{
            // latitude: 53.37429279032434,
            // longitude: -6.414048224687576,
            // latitudeDelta: 0.1922,
            // longitudeDelta: 0.0421}}
            initialRegion={courseLocation}
            showsUserLocation={true}
            mapType={"satellite"}
            onPress={ (event) => {onPressMap(event.nativeEvent.coordinate)} }
          >
            {isMarkerVisable(Constants.TEE_MARKER) ? 
              <Marker draggable
                coordinate={holes[currentHole][Constants.TEE_MARKER]}
                onDragEnd={(e) => setMarker(Constants.TEE_MARKER, e.nativeEvent.coordinate)}
              /> : null}
            {isMarkerVisable(Constants.FAIRWAY_MARKER) ? 
              <Marker draggable
                coordinate={holes[currentHole][Constants.FAIRWAY_MARKER]}
                onDragEnd={(e) => setMarker(Constants.FAIRWAY_MARKER, e.nativeEvent.coordinate)}
              /> : null}
            {isMarkerVisable(Constants.GREEN_MARKER) ? 
              <Marker draggable
                coordinate={holes[currentHole][Constants.GREEN_MARKER]}
                onDragEnd={(e) => setMarker(Constants.GREEN_MARKER, e.nativeEvent.coordinate)}
              /> : null}

            {/* {greenPolygon.map((point, index) => 
              <Marker
                key={'greenPolygon' + index}
                draggable
                title={index + ''}
                coordinate={point}
                onDragEnd={(e) => onDragPolygon(point, e.nativeEvent.coordinate)}
              />
            )}
            <Polygon
              coordinates={greenPolygon}
              strokeColor="#000"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />   */}

          </MapView>
          {currentHole === 0 ? <MapInput notifyChange={(loc) => getCoordsFromName(loc)}/> : null}
          {/* <Fab
            active={fabOpen}
            direction="down"
            style={{ backgroundColor: '#5067FF', position : 'absolute' }}
            position="topRight"
            onPress={() => {setFabOpen(!fabOpen)}}>
              <Icon name="share" />
              <Button 
                style={{ backgroundColor: '#34A34F', position : 'absolute' }}
                onPress={() => onClickButton(() => setTeeMarkerVisable(!teeMarkerVisable))}
                >
                <Icon name="logo-whatsapp" />
              </Button>
              <Button 
                style={{ backgroundColor: '#3B5998' }}
                onPress={() => onClickButton(() => setFairwayMarkerVisable(!fairwayMarkerVisable))}
                >
                <Icon name="logo-facebook" />
              </Button>
              <Button 
                style={{ backgroundColor: '#DD5144' }}
                onPress={() => onClickButton(() => setGreenMarkerVisable(!greenMarkerVisable))}
                >
                <Icon name="mail" />
              </Button>
              <Button 
                style={{ backgroundColor: '#34A34F', position : 'absolute' }}
                onPress={() => onClickButton(() => setAllVisable(!allVisable))}
                >
                <Icon name="logo-whatsapp" />
              </Button>
            </Fab> */}

      </Container>
  );
}

MapHoles.navigationOptions = ({ navigation }) => {
  return {
      headerTitle :  <Text>{'test'}</Text>,
      headerRight: <HeaderButtons goToHole={navigation.getParam('goToHole')}/>
  }
}
