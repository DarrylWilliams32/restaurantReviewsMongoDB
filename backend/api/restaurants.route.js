import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"

const router = express.Router()

/*determins route based on the results of below two methods 
Restaurantsctrl and apiGetRestaurants*/
router.route("/").get(RestaurantsCtrl.apiGetRestaurants)

export default router