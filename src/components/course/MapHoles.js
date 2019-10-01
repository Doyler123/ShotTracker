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
  const { holeData } = useSelector(state  => state.newCourse.courseData[currentHole]) || {}

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
      dispatch(setCourseLocation({  
        location : {
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003
        }
      }))
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
  
  const [map, setMap] = useState()
  // const [fabOpen, setFabOpen] = useState(false)
  
  const isMarkerVisable = (markerName) => {
    return holeData && holeData[markerName]
  }
  
  // const onClickButton = (markerVisable) => {
  //   setTeeMarkerVisable(false)
  //   setFairwayMarkerVisable(false)
  //   setGreenMarkerVisable(false)
  //   markerVisable()
  // }
  
  const onPressMap = (coordinate) => {
    if(holeData){
      if(!holeData[Constants.TEE_MARKER]){
        setMarker[Constants.TEE_MARKER, coordinate]
      }
      else if(!holeData[Constants.FAIRWAY_MARKER]){
        setMarker[Constants.FAIRWAY_MARKER, coordinate]
      }
      else if(!holeData[Constants.GREEN_MARKER]){
        setMarker[Constants.GREEN_MARKER, coordinate]
      }
    }
  }

  const fit = () => {
    var bearing = getBearing(teeMarker.latitude, teeMarker.longitude, greenMarker.latitude, greenMarker.longitude)
    setTimeout(()=>{
      map.fitToCoordinates([teeMarker, fairwayMarker, greenMarker],
         { edgePadding: { top: padding, right: padding, bottom: padding, left: padding }, animated: false })
      map.setCamera({heading : bearing })   
    }, 200)

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
            ref={(ref) => setMap(ref)}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            // onLayout={()=>{fit()}}
            // initialRegion={{
            // latitude: 53.37429279032434,
            // longitude: -6.414048224687576,
            // latitudeDelta: 0.1922,
            // longitudeDelta: 0.0421}}
            region={courseLocation}
            showsUserLocation={true}
            mapType={"satellite"}
            onPress={ (event) => {onPressMap(event.nativeEvent.coordinate)} }
          >
            {isMarkerVisable(Constants.TEE_MARKER) ? 
              <Marker draggable
                coordinate={holeData[Constants.TEE_MARKER]}
                onDragEnd={(e) => setMarker(Constants.TEE_MARKER, e.nativeEvent.coordinate)}
              /> : null}
            {isMarkerVisable(Constants.FAIRWAY_MARKER) ? 
              <Marker draggable
                coordinate={holeData[Constants.FAIRWAY_MARKER]}
                onDragEnd={(e) => setMarker(Constants.FAIRWAY_MARKER, e.nativeEvent.coordinate)}
              /> : null}
            {isMarkerVisable(Constants.GREEN_MARKER) ? 
              <Marker draggable
                coordinate={holeData[Constants.GREEN_MARKER]}
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
          {currentHole == 0 ? <MapInput notifyChange={(loc) => getCoordsFromName(loc)}/> : null}
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
      headerRight: <HeaderButtons />
  }
}
