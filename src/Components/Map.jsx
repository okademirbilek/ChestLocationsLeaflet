import React,{useRef, useState,useEffect} from 'react'
import { MapContainer, TileLayer, Marker, Popup,useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet'
import chestData from '../../chests';

function MapExample(props) {
    const [state,setState] =useState({
        lat: 39.1955251660701,
        lng: 36.15943908691407,
        zoom: 6.3,
        })


    //chest image for marker  
    var myIcon = L.icon({
      iconUrl: 'https://www.freepnglogos.com/uploads/treasure-chest-png/treasure-chest-png-images-transparent-download-19.png',
      iconSize: [65, 70],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      
  });
  
     
    

    let mainPointCoord = chestData.filter(chests => chests.name === props.selected).map(city => city.coords)[0]
    useEffect(() => {
      setState(prevCity => {
        return {
            ...prevCity,
            lat:mainPointCoord[0],
            lng:mainPointCoord[1],
            zoom:10
        }
      })

    }, [mainPointCoord]); // Only re-run the effect 
  
  

    const closestPointstt=chestData.filter(chests => chests.name === props.selected).map(city => city.chests)
    const closestPoints=closestPointstt[0]    

    const showClosestPoints = closestPoints.map(positions => {
      return (<Marker key={positions.key} icon={myIcon} position={[positions.lat,positions.lon]}>
                <Popup>Current location: <pre>{JSON.stringify([positions.lat,positions.lon], null, 2)}</pre></Popup>
              </Marker>)
    })

    function LocationMarker() {
        const [position, setPosition] = useState(null)
        const markerRef = useRef(null)

        function initMarker() {
            const marker = markerRef.current
            if (marker) {
                marker.openPopup()
                
            }
        }

        const map = useMapEvents({
          click(e) {
            setPosition(e.latlng)
            map.locate()
            initMarker()
          },
        })


        
      
        return position === null ? null : (
          <Marker ref={markerRef} position={position}>
            <Popup>Current location: <pre>{JSON.stringify(position, null, 2)}</pre></Popup>
          </Marker>
        )
      }

      
    
  
  return (
    <>
      <MapContainer className="map" center={[state.lat, state.lng]} zoom={state.zoom} ref={props.mapRef}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          {props.query && showClosestPoints}
          
      </MapContainer>
    </>
     
  )
}

export default MapExample