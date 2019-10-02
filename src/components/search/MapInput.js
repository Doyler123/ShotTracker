import React from 'react';
import { PLACES_API_KEY } from '../../../config'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class MapInput extends React.Component {

    render() {
        return (

            <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={2} // minimum length of text to search
                autoFocus={true}
                returnKeyType={'search'} // Can be left out for default return key 
                listViewDisplayed={ false }    // true/false/undefined
                fetchDetails={true}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    console.log(details)
                    this.props.notifyChange(details.geometry.location);
                }
                }

                query={{
                    key: PLACES_API_KEY,
                    language: 'en'
                }}

                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={300}
                styles={{
                    listView : {
                        backgroundColor : 'white'
                    },
                    container : {
                        position : 'absolute',
                        width : '100%'
                    }
                }}
            />
        );
    }
}
export default MapInput;