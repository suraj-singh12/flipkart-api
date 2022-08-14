# ***List Of APIs Used In Different Pages***

# Page 1
## API For Search Bar                                 [GET]
> Local: http://localhost:9200/item/clothes

> Live : https://app2fkartapi.herokuapp.com/item/clothes


# Page 2
## Filter By Popularity                               [GET]
> Local: http://localhost:9200/filter/popularity/refrigerators

> Live : https://app2fkartapi.herokuapp.com/filter/popularity/refrigerators

## Sort By Price (Low To High / High To Low)        [GET]
> Local: http://localhost:9200/filter/price/bags?sort=-1

> Live : https://app2fkartapi.herokuapp.com/filter/price/bags?sort=-1

## Filter By Price (low cost / high cost)              [GET]
> Local: http://localhost:9200/filter/price/bags?lcost=500&hcost=1000

> Live : https://app2fkartapi.herokuapp.com/filter/price/bags?lcost=500&hcost=1000

## Filter and Sort By Price
> Local: http://localhost:9200/filter/price/bags?sort=-1&lcost=500&hcost=1000

> Live : https://app2fkartapi.herokuapp.com/filter/price/bags?sort=-1&lcost=500&hcost=1000

## Filter By Newest First                             [GET]
> Local: http://localhost:9200/filter/new/keyboards

> Live : https://app2fkartapi.herokuapp.com/filter/new/keyboards

## Filter By Discount                                 [GET]
> Local: http://localhost:9200/filter/discount/powerbanks/50

> Live : https://app2fkartapi.herokuapp.com/filter/discount/powerbanks/50

## Filter By Customer Rating                          [GET]
> Local: http://localhost:9200/filter/rating/pillows/3

> Live : https://app2fkartapi.herokuapp.com/filter/rating/pillows/3

## Filter By Offer                                    [GET]
> Local: http://localhost:9200/filter/offers/mouses

> Live : https://app2fkartapi.herokuapp.com/filter/offers/mouses

## API To Open The Clicked Item's Detail Page (fetch item by id) [GET]
> Local: http://localhost:9200/item/clothes?itemId=12

> Live : https://app2fkartapi.herokuapp.com/item/clothes?itemId=12


## Page 3
## API To Add Items To Cart                          [POST]
> Local: http://localhost:9200/cart/add

> Live : https://app2fkartapi.herokuapp.com/cart/add

Example data: 
{
    "image": "https://i.ibb.co/HpkT5G0/5f5c2646fccf.jpg",
    "brand": "IDISI CLOTHES",
    "description": "Unstitched Polycotton Shirt Fabric Printed",
    "new_price": 249,
    "old_price": 999,
    "discount": 75,
    "delivery_type": "Free delivery",
    "hidden_stars": 3.9,
    "item_id": 1,

    "item_type": "clothes",
    "name": "alpha1",
    "email": "alpha1@alpha.com"
}


## API To Add Items To Wishlist                      [POST]
> Local: http://localhost:9200/wishlist/add

> Live : https://app2fkartapi.herokuapp.com/wishlist/add

Example data: 
{
    "image": "https://i.ibb.co/HpkT5G0/5f5c2646fccf.jpg",
    "brand": "IDISI CLOTHES",
    "description": "Unstitched Polycotton Shirt Fabric Printed",
    "new_price": 249,
    "old_price": 999,
    "discount": 75,
    "delivery_type": "Free delivery",
    "hidden_stars": 3.9,
    "item_id": 1,

    "item_type": "clothes",
    "name": "alpha1",
    "email": "alpha1@alpha.com"
}

## API To make an order                            [POST]
> Local: http://localhost:9200/orders/add

> Live : https://app2fkartapi.herokuapp.com/orders/add

Example data: 
{
"order_id": 51,
"item_id": 43,
"item_type": "keyboards",
"amount": 345,
"quantity": 1,
"total_amount": 345,
"name": "alpha1",
"email": "alpha3451@alpha.com",
"phone": 9589658210
}


## API To Remove Items From Cart based on email, item type, & item id         [DELETE]
> Local: http://localhost:9200/cart/delete/alpha14@alpha.com/keyboard/18

> Live : https://app2fkartapi.herokuapp.com/cart/delete/alpha14@alpha.com/keyboard/18

## API To Remove Items From Wishlist                                          [DELETE]
> Local: http://localhost:9200/wishlist/delete/alpha1@alpha.com/mouses/58

> Live : https://app2fkartapi.herokuapp.com/wishlist/delete/alpha1@alpha.com/mouses/58



# Page 4
## List of Cart Items                                [GET]  
> Local: http://localhost:9200/cart/getAll

> Live : https://app2fkartapi.herokuapp.com/cart/getAll

## List of Cart Items of particular user             [GET]
> Local: http://localhost:9200/cart/get/alpha1@alpha.com

> Live : https://app2fkartapi.herokuapp.com/cart/get/alpha1@alpha.com

## List Of Wishlist Items                            [GET]
> Local: http://localhost:9200/wishlist/getAll

> Live : https://app2fkartapi.herokuapp.com/wishlist/getAll

## List of Wishlist Items of particular user         [GET]
> Local: http://localhost:9200/wishlist/get/alpha1@alpha.com

> Live : https://app2fkartapi.herokuapp.com/wishlist/get/alpha1@alpha.com

## Get Wishlist Items of a particular user by ItemType, ItemId       [GET]
<!-- this will be used to check if user is trying to add same item to wishlist again -->
> Local : http://localhost:9200/wishlist/getItemById/suraj@gmail.com/clothes/45

> Live : https://app2fkartapi.herokuapp.com/wishlist/getItemById/suraj@gmail.com/clothes/45

## List of Orders Placed                             [GET]
> Local: http://localhost:9200/orders/getAll

> Live : https://app2fkartapi.herokuapp.com/orders/getAll

## List Of orders of particular User                [GET]
> Local: http://localhost:9200/orders/get/alpha1@alpha.com

> Live : https://app2fkartapi.herokuapp.com/orders/get/alpha1@alpha.com


## API To Update User's Orders using order number   [PUT]
> Local: http://localhost:9200/orders/update/2575

> Live : https://app2fkartapi.herokuapp.com/orders/update/2575

Example data:
{
"transaction_state": "Completed",
"date": "06-06-2022",
"bank_name": "SBI"
}


# Additional APIs to delete data                    [for-developer-only]

## API to delete all cart items from database               [DELETE]
> Local: http://localhost:9200/cart/deleteAll

> Live : https://app2fkartapi.herokuapp.com/cart/deleteAll

## API to delete all cart items of particular user          [DELETE]
> Local: http://localhost:9200/cart/deleteAll?email=alpha1@alpha.com

> Live : https://app2fkartapi.herokuapp.com/cart/deleteAll?email=alpha1@alpha.com

## API to delete all wishlist items from database           [DELETE]
> Local: http://localhost:9200/wishlist/deleteAll

> Live : https://app2fkartapi.herokuapp.com/wishlist/deleteAll

## API to delete all wishlist items of particular user      [DELETE]
> Local: http://localhost:9200/wishlist/deleteAll?email=alpha1@alpha.com

> Live : https://app2fkartapi.herokuapp.com/wishlist/deleteAll?email=alpha1@alpha.com

## API to delete all orders from database                   [DELETE]
> Local: http://localhost:9200/orders/deleteAll

> Live : https://app2fkartapi.herokuapp.com/orders/deleteAll

## API to delete all orders of particular user              [DELETE]
> Local: http://localhost:9200/orders/deleteAll?email=alpha1@alpha.com

> Live : https://app2fkartapi.herokuapp.com/orders/deleteAll?email=alpha1@alpha.com



