import { useState } from "react"
import {
    withGoogleMap,
    GoogleMap,
    Marker,
    Polygon,
} from "react-google-maps";
import { useQuery, gql } from "@apollo/client"


export default function GameArea() {

    const MapWithAMarker = withGoogleMap(props =>
        <GoogleMap
            defaultZoom={11}
            defaultCenter={{ lat: init.center.lat, lng: init.center.lng }}
        >
            {data &&
                <Polygon path={makePolygon()}
                    key={1}
                    options={{
                        fillColor: "#000",
                        fillOpacity: 0.1,
                        strokeColor: "#000",
                        strokeOpacity: 1,
                        strokeWeight: 1
                    }}>

                </Polygon>
            }

            <Marker
                position={{ lat: 55.25105786157893, lng: 14.823528312030481 }}
            />
        </GoogleMap>
    );

    const makePolygon = () => {
        const coordinates: number[] = data.getGameArea.coordinates[0]
        const polygon = coordinates.map((x: any) => {
            return { lat: x[1], lng: x[0] }
        })
        return polygon
    }



    const [init, setInit] = useState({ center: { lat: 55.12640251905327, lng: 14.90647496863807 }, zoom: 11 })

    const GET_GAMEAREA = gql`
        query{getGameArea {coordinates}}
    `

    const { loading, error, data, refetch } = useQuery(
        GET_GAMEAREA,
        {
            fetchPolicy: "cache-and-network"
            // pollInterval: 1000
        }
    )

    return (

        <MapWithAMarker
            containerElement={<div style={{ height: `1200px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
        />

    );
}