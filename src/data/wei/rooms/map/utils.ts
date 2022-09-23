const radius = 6371      //Earth Radius in Km

interface Point {
    scrX: number
    scrY: number
    lat: number
    lng: number
    pos?: Position
}
interface Position {
    x: number
    y: number
}

export function generatePositionUtil(p0: Point, p1: Point) {
    //## Now I can calculate the global X and Y for each reference point ##\\

    // This function converts lat and lng coordinates to GLOBAL X and Y positions
    function latlngToGlobalXY(lat: number, lng: number){
        //Calculates x based on cos of average of the latitudes
        const x = radius*lng*Math.cos((p0.lat + p1.lat)/2)
        //Calculates y based on latitude
        const y = radius*lat
        return {x: x, y: y}
    }

    // Calculate global X and Y for top-left reference point
    p0.pos = latlngToGlobalXY(p0.lat, p0.lng)
    // Calculate global X and Y for bottom-right reference point
    p1.pos = latlngToGlobalXY(p1.lat, p1.lng)

    /*
    * This gives me the X and Y in relation to map for the 2 reference points.
    * Now we have the global AND screen areas and then we can relate both for the projection point.
    */

    // This function converts lat and lng coordinates to SCREEN X and Y positions
    function latlngToScreenXY(lat: number, lng: number){
        //Calculate global X and Y for projection point
        const pos = latlngToGlobalXY(lat, lng)
        //Calculate the percentage of Global X position in relation to total global width
        const perX = ((pos.x-p0.pos!.x)/(p1.pos!.x - p0.pos!.x))
        //Calculate the percentage of Global Y position in relation to total global height
        const perY = ((pos.y-p0.pos!.y)/(p1.pos!.y - p0.pos!.y))

        //Returns the screen position based on reference points
        return {
            x: p0.scrX + (p1.scrX - p0.scrX)*perX,
            y: p0.scrY + (p1.scrY - p0.scrY)*perY
        }
    }

    return latlngToScreenXY

}