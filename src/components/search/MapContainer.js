import React from 'react';
import { View } from 'react-native';
import MapInput from './MapInput';
import MyMapView from './MapView';
import { getLocation, geocodeLocationByName } from '../../services/location-service';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Container } from 'native-base';



class MapContainer extends React.Component {
    state = {
        region: {}
    };

    componentDidMount() {
        this.getInitialState();
    }

    getInitialState() {
        getLocation().then(
            (data) => {
                console.log(data);
                this.setState({
                    region: {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003
                    }
                });
            }
        );
    }

    getCoordsFromName(loc) {
        this.setState({
            region: {
                latitude: loc.lat,
                longitude: loc.lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
            }
        });
    }

    onMapRegionChange(region) {
        this.setState({ region });
    }

    render() {
        return (
            <Container>
                <MapView
                    style={{ flex: 1 }}
                    provider={PROVIDER_GOOGLE}
                    region={this.state.region}
                    showsUserLocation={true}
                    // onRegionChange={(reg) => this.onMapRegionChange(reg)}
                    mapType={"satellite"}
                >  
                </MapView>
                <MapInput notifyChange={(loc) => this.getCoordsFromName(loc)}/>
            </Container>
            // <View style={{ flex: 1 }}>
            //     <View style={{ flex: 1 }}>
            //         <MapInput notifyChange={(loc) => this.getCoordsFromName(loc)}/>
            //     </View>

            //     {
            //         this.state.region['latitude'] ?
            //             <View style={{ flex: 1 }}>
            //                 <MyMapView
            //                     region={this.state.region}
            //                     onRegionChange={(reg) => this.onMapRegionChange(reg)} />
            //             </View> : null}
            // </View>
        );
    }
}

export default MapContainer;