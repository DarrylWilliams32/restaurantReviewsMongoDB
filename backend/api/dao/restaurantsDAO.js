//stores the db info into variable 'restaurants'
let restaurants

export default class RestaurantsDAO {
    static async injectDB(conn) {
        if (restaurants) {
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }
//creates method to get restaurant data
 static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
} = {}) {
    let query
    if (filters) {
        if ("name" in filters) {
            /*for catching text searches by user. Will need to be setup in 
            mongodb*/
            query = {$text: {$search: filters ["name"] } }
        } else if ("cuisine" in filters) {
            query = {"cuisine": {$eq: filters["cuisine"] } }
        } else if ("zipcode" in filters) {
            query = {"address.zipcode": {$eq: filters["zipcode"] } }
        }
    }

    let cursor

    try {
        cursor = await restaurants
        //this will find all restaurants in db that fit query we passed above
        .find(query)
    } catch (e) {
        console.error(`Unable to issue find command, ${e}`)
        //if no query set, it will return all restaurants
        return { restaurantsList: [], totalNumRestaurants: 0 }
    }

    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

    try {
        //saves restaurants list to an array and saves within variable restaurantsList
        const restaurantsList = await displayCursor.toArray()
        //gets total number of restaurants
        const totalNumRestaurants = await restaurants.countDocuments(query)
        
        return {restaurantsList, totalNumRestaurants}
    } catch (e) {
        console.error(
            `Unable to convert cursor to array or problem counting documents, ${e}`
        )
        return {restaurantsList: [], totalNumRestaurants: 0}
    }
}
}