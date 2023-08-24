import { Rarities, RewardCategories } from "~/pages";
import { getDaysBetweenDates } from "./datetime";

export function calculateCostAndDiscount(rarity: Rarities, expire_at: Date | undefined | null) {
    let cost = 0
    let discount = 1
    let costs = {
        Common: 50,
        Rare: 100,
        Epic: 250,
        Legendary: 500
    }

    cost += costs[rarity]

    // if expire date is less than 3 days out give 10% off 
    if (expire_at) {
        if (getDaysBetweenDates(new Date(), expire_at) <= 3) {
            discount = 0.9
        }
    }

    // add random discount, will overwrite the expire date discount
      const num = Math.floor(Math.random() * 100);

      // one out of 100 give half off 
      if (num == 0) {
        discount = 0.5
      }

      // 5 more out of 100 give 1.5x
      if (num > 0 && num < 6) {
        discount = 0.75
      }

      // 5 more give 1.2
      if (num >= 6 && num < 11) {
        discount = 0.9
      }

    return {
        cost: cost,
        discount: discount
    }

    

}