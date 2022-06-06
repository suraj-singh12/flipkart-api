# ***List Of APIs Used In Different Pages***

# Page 1
## API For Search Bar                                 [GET]
> Local: http://localhost:9200/item/clothes

> Live : https://app2fkartapi.herokuapp.com/item/clothes


# Page 2
## Filter By Popularity                               [GET]
> Local: http://localhost:9200/filter/popularity/refrigerators

> Live : https://app2fkartapi.herokuapp.com/filter/popularity/refrigerators

## Filter By Price (Low To High / High To Low)        [GET]
> Local: http://localhost:9200/filter/price/bags?sort=-1

> Live : https://app2fkartapi.herokuapp.com/filter/price/bags?sort=-1

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
    "item_id": 58,
    "item_type": "mouses",
    "name": "alpha1",
    "email": "alpha1@alpha.com"
}


## API To Add Items To Wishlist                      [POST]
> Local: http://localhost:9200/wishlist/add

> Live : https://app2fkartapi.herokuapp.com/wishlist/add

Example data: 
{
    "item_id": 58,
    "item_type": "mouses",
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
"name": "alpha1",
"email": "alpha3451@alpha.com",
"phone": 9589658210,
"amount": 345,
"bank_name": "SBI"
}


## API To Remove Items From Cart based on email, item type, & item id         [DELETE]
> Local: http://localhost:9200/cart/delete/alpha14@alpha.com/keyboard/18

> Live : https://app2fkartapi.herokuapp.com/cart/delete/alpha14@alpha.com/keyboard/18

## API To Remove Items From Wishlist                                          [DELETE]
> Local: http://localhost:9200/wishlist/delete/alpha1@alpha.com/mouses/58

> Live : https://app2fkartapi.herokuapp.com/wishlist/delete/alpha1@alpha.com/mouses/58



# Page 4
## List of Cart Items                                [GET]  
> Local: http://localhost:9200/cart/get

> Live : https://app2fkartapi.herokuapp.com/cart/get

## List of Cart Items of particular user             [GET]
> Local: http://localhost:9200/cart/get?email=alpha1@alpha.com

> Live : https://app2fkartapi.herokuapp.com/cart/get?email=alpha1@alpha.com

## List Of Wishlist Items                            [GET]
> Local: http://localhost:9200/wishlist/get

> Live : https://app2fkartapi.herokuapp.com/wishlist/get

## List of Wishlist Items of particular user         [GET]
> Local: http://localhost:9200/wishlist/get?email=alpha1@alpha.com

> Live : https://app2fkartapi.herokuapp.com/wishlist/get?email=alpha1@alpha.com

## List of Orders Placed                             [GET]
> Local: http://localhost:9200/orders/get

> Live : https://app2fkartapi.herokuapp.com/orders/get

## List Of orders of particular User                [GET]
> Local: http://localhost:9200/orders/get?email=alpha1@alpha.com

> Live : https://app2fkartapi.herokuapp.com/orders/get?email=alpha1@alpha.com


## API To Update User's Orders using order number   [PUT]
> Local: http://localhost:9200/orders/update/2575

> Live : https://app2fkartapi.herokuapp.com/orders/update/2575

Example data:
{
"transaction_state": "Completed",
"date": "06-06-2022"
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



