//var bodyParser = require('body-parser'); 	// get body-parser
var User = require('../models/user');
var List = require('../models/list');
var SortOrder = require('../models/sortOrder');
var jwt  = require('jsonwebtoken');
var secret = 'moufeeisthebearthesuperpolarbearursusmaritimus';


module.exports = function(app,express, io){
    var apiRouter = express.Router();
    //route for authenticating
    apiRouter.post('/auth', function (req, res) {
        User.findOne({email:req.body.email}).select('name email password').exec(function (err, user) {
            if(err) throw err;

            if(!user){
                res.json({
                    success:false,
                    message: 'No user with the given email address was found.'
                });
            }
            else if(user){

                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword){
                    res.json({success:false, message:"Incorrect Password"})
                }else {
                    var token = jwt.sign({
                            firstName:user.firstName,
                            name: user.name,
                            email: user.email,
                            id: user._id
                        },
                        secret,
                        {
                            //expiresInMinutes: 10080
                        });

                    res.json({
                        success: true,
                        token: token
                    });
                }
            }
        });
    });
    //route for registering new user
    apiRouter.route('/users')
        .post(function(req,res) {
            var user = new User();

            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.name = user.firstName + ' ' + user.lastName;
            user.email = req.body.email;
            user.password = req.body.password;

            user.save(function (err) {
                if (err) {
                    if (err.code == 11000)
                        res.json({success: false, message: 'A user with that email address already exists.'});
                    else
                        res.json({success:false, message: 'An error occurred.', error:err});
                } else
                    res.json({success: true, message: 'user created'});
            });
        });

    //middleware for checking authentication
    apiRouter.use(function (req, res, next) {
        var token = req.body.token || req.params.token ||req.headers['x-access-token'];

        if(token){
            jwt.verify(token,secret,function(err, decoded){
                if(err){
                    return res.status(403).send({success:false,message:'Failed to authenticate token'});
                }else{
                    req.decoded = decoded;
                    next();
                }
            })
        }else{
            //no token provided
            return res.status(403).send({
                success:false,
                message: 'No token provided'
            });
        }
    });

    //middleware for routes with list_id parameter, finds list and stores in request object for later use
    apiRouter.param('list_id', function (req, res, next, id) {
        List.findById(id)
            .populate('selectedCategorySortOrder')
            .populate('sharedWith', '_id name email')
            .exec( function (err, list) {
            if(err)
                res.status(404).json({success:false, message:'An error occurred, the list could not be found.'});
            else if(list) {
                req.list = list;
                next();
            }
            else
                res.status(404).json({success:false, message:'The list could not be found.'})
        })

    });





    apiRouter.get('/',function(req,res){
        res.json({message:'welcome to the api!'});
    });

    apiRouter.route('/me')
        .get(function (req, res) {
            User.findById(req.decoded.id, function (err, user) {
                if(err)
                    res.json({success:false, message: 'An error occurred'});
                else
                    res.json(user);
            });
        })
        .put(function (req, res) {
            User.findById(req.decoded.id, function (err, user) {
                if(req.body.firstName) user.firstName = req.body.firstName;
                if(req.body.lastName) user.lastName = req.body.lastName;
                if(req.body.email) user.email = req.body.email;
                if(req.body.password) user.password = req.body.password;
                if(req.body.firstName || req.body.lastName) user.name = user.firstName + ' ' + user.lastName;

                user.save(function (err) {
                    if(err) {
                        if (err.code == 11000)
                            res.json({success: false, message: 'A user with that email address already exists.'});
                        else
                            res.json({success: false, message: 'An error occurred.'});
                    }
                    else
                        res.json({success:true, message: 'Your details were updated.', user:user});
                });
            });
        });

    apiRouter.route('/orders')
        .get(function (req, res) {
            SortOrder.find({owner:req.decoded.id}, function (err, orders) {
                if(err||orders==null) res.json({success:false, message:'Error getting sort orders.'});
                else{
                    res.json(orders);
                }
            })
        })
        .post(function (req, res) {
            var order = new SortOrder;
            if(req.body.name&&req.body.name!=''&&req.body.order){
                try{
                    order.name = req.body.name;
                    order.order = JSON.parse(req.body.order);
                    order.owner = req.decoded.id;

                    order.save(function (err, order) {
                        if(err) res.json({success:false, message:'Error saving order.'});
                        else{
                            res.json(order);
                        }
                    })
                }catch (e){
                    res.json({success:false, message:'An error occurred. Ensure array is properly formatted.'});
                }

            }else{
                res.json({success:false, message:'Required params not present.'});
            }
        });
    apiRouter.route('/orders/:orderId')
        .get(function (req, res) {
            SortOrder.findById(req.params.orderId, function (err, order) {
                if(err)
                    res.json({success:false, message:'Unable to find sort order.'});
                else res.json(order);
            })
        })
        .put(function (req, res) {
            SortOrder.findById(req.params.orderId, function (err, order) {
                if(err)
                    res.json({success:false, message:'Unable to find sort order.'});
                else {
                    try{
                        if(req.body.order) order.order = JSON.parse(req.body.order);
                        if(req.body.name&&req.body.name!='') order.name = req.body.name;
                        order.save(function (err, order) {
                            if(err)
                                res.json({success:false, message:'Error saving order'});
                            else
                                res.json(order);
                        });
                    } catch (e){
                        res.json({success:false, message:'Check array formatting.'});
                    }
                }
            })
        })
        .delete(function (req, res) {
            SortOrder.remove({_id:req.params.orderId}, function (err) {
                if(err){
                    res.json({success:false});
                }else{
                    res.json({success:true, message:'Sort Order Deleted'});
                }
            })
        });

    //routes for changing list sharing
    apiRouter.route('/sharing/:list_id')
        .post(function (req, res) {
            var list = req.list;
            if(req.body.email){
                User.findOne({email:req.body.email}, function (err, user) {
                    if(err ||!user){
                        res.json({success:false, message: 'User not found, please ensure that the person has registered.'});
                    }else if(list.sharedWith.indexOf(user._id)==-1) {
                        list.sharedWith.push(user._id);
                        if(list.sharedWith.length>0) list.shared = true;
                        list.save(function (err, list) {
                            if (err) {
                                res.json({success: false, message: 'An error occurred.'});
                            } else {
                                res.json({success: true, message: 'The list was successfully shared.'});
                                io.to(req.decoded.id).emit('lists-updated');
                                if(list.sharedWith!=null && list.sharedWith.length>0){
                                    for(var i = 0;i<list.sharedWith.length;i++){
                                        io.to(list.sharedWith[i]._id).emit('lists-updated');
                                    }
                                }
                            }
                        });
                    }else if(list.sharedWith.indexOf(user._id)!==-1){
                        res.json({success:false,message:'The list is already shared with that user.'})
                    }
                })
            }else{
                res.json({success:false, message:'Invalid request'});
            }
        })
        .get(function (req, res) {
            res.json(req.list.sharedWith);
        })
        .delete(function (req, res) {
            var list = req.list;
            if(req.body.id){
                var id = req.body.id;
                list.sharedWith.id(req.body.id).remove();
                if(list.sharedWith.length==0) list.shared = false;
                list.save(function (err, list) {
                    res.json({success:true, list:list});
                })
            }else{
                res.json({success:false, message:'An ID is required.'});
            }

        });







    //route for getting all lists or creating a list
    apiRouter.route('/lists')
        .get(function (req, res) {
            List.find()
                .or([{owner:req.decoded.id},{sharedWith:req.decoded.id}])
                //.select('_id name shared')
                .sort('created')
                .populate('selectedCategorySortOrder')
                .exec( function (err, lists) {
                if(err)
                    res.json({success:false, message: 'An error occurred, check authentication.'});
                else
                    res.json(lists);
            });
        })
        .post(function (req, res) {
            var list = new List;
            list.name = req.body.name;
            list.owner = req.decoded.id;
            list.categorySortOrder = ["Baby", "Bakery", "Beverages", "Breakfast & Cereal", "Condiments & Dressings", "Cooking & Baking", "Dairy", "Deli", "Frozen Foods", "Grains", "Health & Personal Care", "Household & Cleaning", "Meat", "Pet Supplies", "Produce", "Seafood", "Snacks", "Soups & Canned Goods", "Wine", "Office Supplies", "Hardware", "Sporting Goods", "Other"];

            list.save(function (err, list) {
                if(err)
                    res.send({success:false, message: 'An error occurred saving the list.', error:err.message});
                else {
                    res.json({success: true, message: 'list created', list: list});
                    io.to(list.owner).emit('list-created',list);
                    io.to(list.owner).emit('lists-updated');
                    if(list.sharedWith!=null){
                        for(var i = 0;i<list.sharedWith.length;i++){
                            io.to(list.sharedWith[i]._id).emit('lists-updated');
                        }
                    }
                }
            });
        });



    //route for getting a specific list and adding items to it or updating category sort order
    apiRouter.route('/lists/:list_id')
        //route for deleting a list
        .delete(function (req, res) {
            var list = req.list;
            //make sure user is deleting own list
            if(req.list.owner==req.decoded.id){
                List.remove({_id:req.params.list_id}, function (err) {
                    if (err)
                        res.json({success: false, message: 'An error occurred'});
                    else {
                        //only the onwer can delete lists, only the owner needs to be notified
                        res.json({success: true, message: 'Successfully deleted list.'});
                        io.to(req.decoded.id).emit('lists-updated')
                    }
                })
            }else{
                res.json({success:false, message:'You are unauthorised. Your existence will be terminated.'});
            }

        })
        .post(function (req, res) {
            var list = req.list;
            //make sure the added item is not an empty string
            if(req.body.name !== ""&&req.body.name) {
                list.items.push({name: req.body.name, category: req.body.category, completed: false});
                list.save(function (err, list) {
                    if (err)
                        res.json({success: false, message: 'An error occurred.'});
                    else {
                        res.json({success: true, items: list.items});
                        io.to(list.owner).emit('lists-updated');
                        io.emit('item-added',{name: req.body.name, category: req.body.category, completed: false});
                        if(list.sharedWith!=null && list.sharedWith.length>0){
                            for(var i = 0;i<list.sharedWith.length;i++){
                                io.to(list.sharedWith[i]._id).emit('lists-updated');
                                console.log(list.sharedWith[i]._id);
                            }
                        }
                    }
                })
            }else{
                res.json({success:false, message: 'The item name was not included.'})
            }
        })
        .get(function (req, res) {
            res.json(req.list);
        })
        .put(function (req, res) {
            var list = req.list;
            try{
                if(req.body.categorySortOrder) {
                    list.categorySortOrder = JSON.parse(req.body.categorySortOrder);
                }
                if(req.body.name) list.name = req.body.name;
                if(req.body.selectedCategorySortOrder) list.selectedCategorySortOrder = req.body.selectedCategorySortOrder;
                list.save(function (err, list) {
                    if(err){
                        res.json({success:false, message:'An error occurred.'});
                    }else{
                        res.json({success:true, message: 'List Updated'});
                        io.to(list.owner).emit('lists-updated');
                        if(list.sharedWith!=null && list.sharedWith.length>0){
                            for(var i = 0;i<list.sharedWith.length;i++){
                                io.to(list.sharedWith[i]._id).emit('lists-updated');
                            }
                        }
                    }
                });
            }catch (e){
                res.json({success:false, message: e.name})
            }

        });

    apiRouter.route('/lists/:list_id/items/:item_id')
        .delete(function (req, res) {
            var list = req.list;
            list.items.id(req.params.item_id).remove();
            list.save(function (err) {
                if(err)
                    res.json({success:false, message: 'An error occurred.'});
                else {
                    res.json({success: true, message: 'Item was successfully deleted.', items: list.items});
                    io.to(list.owner).emit('lists-updated');
                    io.to(list.owner).emit('item-deleted', req.params.item_id);
                    if(list.sharedWith!=null && list.sharedWith.length>0){
                        for(var i = 0;i<list.sharedWith.length;i++){
                            io.to(list.sharedWith[i]._id).emit('lists-updated');
                        }
                    }
                }
            })


        })
        .get(function (req, res) {
            var list = req.list;
            if(list&&list.items.id(req.params.item_id))
                res.json(list.items.id(req.params.item_id));

        })
        .put(function (req, res) {
            var list = req.list;
            var item = list.items.id(req.params.item_id);
            if(req.body.name) item.name = req.body.name;
            if(req.body.note) item.note = req.body.note;
            if(req.body.completed!=null) item.completed = req.body.completed;
            if(req.body.category) item.category = req.body.category;
            item.modified = Date.now();
            //todo: is there a way to actually check if it was actually modified?

            list.save(function (err) {
                if (err)
                    res.json({success:false});
                else {
                    res.json({success: true, message: 'Item was updated', item: item});
                    io.to(list.owner).emit('lists-updated');
                    io.to(list.owner).emit('item-updated',item);
                    if(list.sharedWith!=null && list.sharedWith.length>0){
                        for(var i = 0;i<list.sharedWith.length;i++){
                            io.to(list.sharedWith[i]._id).emit('lists-updated');
                        }
                    }
                }
            })
        });

    return apiRouter;
};