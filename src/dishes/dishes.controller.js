const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res) {
  res.json({ data: dishes });
};


function create(req, res)  {
  const { data: { name, description, price, image_url } = {} } = req.body;

  const newDish = {
    id: nextId(),
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};

function dBody(req, res, next) {
  const {data: {name, description, price, image_url} = {} } = req.body;
  if (!name || name === "") {
    return next({status: 400, message: "Dish must include a name."})
  }
  if (!description || description === "") {
    return next({status: 400, message: "Dish must include a description."})
}
  if (!price) {
    return next({status: 400, message: "Dish must include a price."})
  }
   if (price <=0 || !Number.isInteger(price)) {
    return next({status: 400, message: "Dish must have a price that is an integer greater than 0."})
  }
  if (!image_url || image_url === "") {
    return next({status: 400, message: "Dish must include a image_url."})
  }
next();
}


function read(req, res) {
  res.json({data: res.locals.dish})
}

function dishExist(req, res, next) {
  const {dishId} = req.params
  const foundDish = dishes.find((dish) => dish.id === dishId)
  if (foundDish) {
    res.locals.dish = foundDish
    return next()
  }
  next({
    status: 404,
    message: `Dish id does not exist ${dishId}`,
  })
}

function update(req, res) {
  const {data: {name, description, price, image_url} = {} } = req.body
  res.locals.dish = {
    id: res.locals.dishId,
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  }
  res.json({data: res.locals.dish})
}

function dishIdValidation(req, res, next) {
  const {dishId} = req.params;
  const {data: {id} = {} }= req.body;
  if (!id || id === dishId) {
    res.locals.dishId = dishId
    return next()
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
  })
}


module.exports = {
  list,
  create: [ dBody, create],
  read: [ dishExist, read],
  update: [ dishExist, dBody, dishIdValidation, update],
  
}