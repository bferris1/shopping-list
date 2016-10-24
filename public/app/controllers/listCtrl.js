angular.module('listCtrl', ['listService', 'ui.bootstrap'])
    .controller('listController', function (List, $http) {
        var vm = this;
        var currentListIndex = 0;
        vm.sortOrders = null;
        vm.autocomplete = [
            {name:'New York Deli Sandwich', category:'Deli'},
            {name:'Cheese', category:'Dairy'},
            {name:'Dill Spears', category:"Condiments & Dressings"},
            {name: 'Clancy\'s', category:'Snacks'},
            {name: 'Yoghurt', category: 'Dairy'},
            {name: 'Brummel & Brown', category: 'Dairy'},
            {"name":"Asparagus","category":"Produce"},
            {"name":"Broccoli","category":"Produce"},
            {"name":"Carrots","category":"Produce"},
            {"name":"Cauliflower","category":"Produce"},
            {"name":"Celery","category":"Produce"},
            {"name":"Corn","category":"Produce"},
            {"name":"Cucumbers","category":"Produce"},
            {"name":"Lettuce / Greens","category":"Produce"},
            {"name":"Mushrooms","category":"Produce"},
            {"name":"Onions","category":"Produce"},
            {"name":"Peppers","category":"Produce"},
            {"name":"Potatoes","category":"Produce"},
            {"name":"Spinach","category":"Produce"},
            {"name":"Squash","category":"Produce"},
            {"name":"Zucchini","category":"Produce"},
            {"name":"Tomatoes","category":"Produce"},
            {"name":"Apples","category":"Produce"},
            {"name":"Avocados","category":"Produce"},
            {"name":"Bananas","category":"Produce"},
            {"name":"Berries","category":"Produce"},
            {"name":"Cherries","category":"Produce"},
            {"name":"Grapefruit","category":"Produce"},
            {"name":"Grapes","category":"Produce"},
            {"name":"Kiwis","category":"Produce"},
            {"name":"Lemons / Limes","category":"Produce"},
            {"name":"Melon","category":"Produce"},
            {"name":"Nectarines","category":"Produce"},
            {"name":"Oranges","category":"Produce"},
            {"name":"Peaches","category":"Produce"},
            {"name":"Pears","category":"Produce"},
            {"name":"Plums","category":"Produce"},
            {"name":"BBQ sauce","category":"Condiments & Dressings"},
            {"name":"Gravy","category":"Condiments & Dressings"},
            {"name":"Honey","category":"Condiments & Dressings"},
            {"name":"Hot sauce","category":"Condiments & Dressings"},
            {"name":"Jam","category":"Condiments & Dressings"},
            {"name":"Jely","category":"Condiments & Dressings"},
            {"name":"Preserves","category":"Condiments & Dressings"},
            {"name":"Ketchup / Mustard","category":"Condiments & Dressings"},
            {"name":"Mustard","category":"Condiments & Dressings"},
            {"name":"Mayonnaise","category":"Condiments & Dressings"},
            {"name":"Pasta sauce","category":"Condiments & Dressings"},
            {"name":"Relish","category":"Condiments & Dressings"},
            {"name":"Salad dressing","category":"Condiments & Dressings"},
            {"name":"Salsa","category":"Condiments & Dressings"},
            {"name":"Soy sauce","category":"Condiments & Dressings"},
            {"name":"Pickles","category":"Condiments & Dressings"},
            {"name":"Steak sauce","category":"Condiments & Dressings"},
            {"name":"Syrup","category":"Condiments & Dressings"},
            {"name":"Worcestershire sauce","category":"Condiments & Dressings"},
            {"name":"Butter / Margarine","category":"Dairy"},
            {"name":"Cottage cheese","category":"Dairy"},
            {"name":"Half & half","category":"Dairy"},
            {"name":"Milk","category":"Dairy"},
            {"name":"Sour cream","category":"Dairy"},
            {"name":"Whipped cream","category":"Dairy"},
            {"name":"Yogurt","category":"Dairy"},
            {"name":"Buttermilk","category":"Dairy"},
            {"name":"Applesauce","category":"Canned Goods"},
            {"name":"Baked beans","category":"Canned Goods"},
            {"name":"Broth","category":"Canned Goods"},
            {"name":"Fruit","category":"Canned Goods"},
            {"name":"Olives","category":"Canned Goods"},
            {"name":"Tinned meats","category":"Canned Goods"},
            {"name":"Tuna / Chicken","category":"Canned Goods"},
            {"name":"Soup / Chili","category":"Canned Goods"},
            {"name":"Canned Tomatoes","category":"Canned Goods"},
            {"name":"Veggies","category":"Canned Goods"},
            {"name":"Bleu cheese","category":"Dairy"},
            {"name":"Cheddar","category":"Dairy"},
            {"name":"Cottage cheese","category":"Dairy"},
            {"name":"Cream cheese","category":"Dairy"},
            {"name":"Feta","category":"Dairy"},
            {"name":"Goat cheese","category":"Dairy"},
            {"name":"Mozzarella","category":"Dairy"},
            {"name":"Parmesan","category":"Dairy"},
            {"name":"Provolone","category":"Dairy"},
            {"name":"Ricotta","category":"Dairy"},
            {"name":"Sandwich slices","category":"Dairy"},
            {"name":"Swiss","category":"Dairy"},
            {"name":"Beer","category":"Wine, Beer, & Spirits"},
            {"name":"Champagne","category":"Wine, Beer, & Spirits"},
            {"name":"Gin","category":"Wine, Beer, & Spirits"},
            {"name":"Red wine / White wine","category":"Wine, Beer, & Spirits"},
            {"name":"Rum","category":"Wine, Beer, & Spirits"},
            {"name":"Sak�","category":"Wine, Beer, & Spirits"},
            {"name":"Whiskey","category":"Wine, Beer, & Spirits"},
            {"name":"Bacon / Sausage","category":"Meat"},
            {"name":"Beef","category":"Meat"},
            {"name":"Chicken","category":"Meat"},
            {"name":"Ground beef / Turkey","category":"Meat"},
            {"name":"Ham / Pork","category":"Meat"},
            {"name":"Pork","category":"Meat"},
            {"name":"Hot dogs","category":"Meat"},
            {"name":"Deli Meat","category":"Meat"},
            {"name":"Turkey","category":"Meat"},
            {"name":"Catfish","category":"Seafood"},
            {"name":"Crab","category":"Seafood"},
            {"name":"Lobster","category":"Seafood"},
            {"name":"Mussels","category":"Seafood"},
            {"name":"Oysters","category":"Seafood"},
            {"name":"Salmon","category":"Seafood"},
            {"name":"Shrimp","category":"Seafood"},
            {"name":"Tilapia","category":"Seafood"},
            {"name":"Tuna","category":"Seafood"},
            {"name":"Candy","category":"Snacks"},
            {"name":"Cookies","category":"Snacks"},
            {"name":"Crackers","category":"Snacks"},
            {"name":"Dried fruit","category":"Snacks"},
            {"name":"Granola bars","category":"Snacks"},
            {"name":"Nuts / Seeds","category":"Snacks"},
            {"name":"Oatmeal","category":"Snacks"},
            {"name":"Popcorn","category":"Snacks"},
            {"name":"Potato Chips","category":"Snacks"},
            {"name":"Pretzels","category":"Snacks"},
            {"name":"Gum","category":"Snacks"},
            {"name":"Cereal","category":"Breakfast & Cereal"},
            {"name":"Baking powder / Soda","category":"Baking"},
            {"name":"Bread crumbs","category":"Baking"},
            {"name":"Brownie Mix","category":"Baking"},
            {"name":"Cake Mix","category":"Baking"},
            {"name":"Cake icing","category":"Baking"},
            {"name":"Cocoa","category":"Baking"},
            {"name":"Chocolate chips","category":"Baking"},
            {"name":"Flour","category":"Baking"},
            {"name":"Shortening","category":"Baking"},
            {"name":"Sugar","category":"Baking"},
            {"name":"Sugar substitute","category":"Baking"},
            {"name":"Yeast","category":"Baking"},
            {"name":"Antiperspirant / Deodorant","category":"Heath & Personal Care"},
            {"name":"Bath soap","category":"Heath & Personal Care"},
            {"name":"Hand Soap","category":"Heath & Personal Care"},
            {"name":"Cosmetics","category":"Heath & Personal Care"},
            {"name":"Cotton swabs / Balls","category":"Heath & Personal Care"},
            {"name":"Facial cleanser","category":"Heath & Personal Care"},
            {"name":"Facial tissue","category":"Heath & Personal Care"},
            {"name":"Hair Spray","category":"Heath & Personal Care"},
            {"name":"Floss","category":"Heath & Personal Care"},
            {"name":"Hair Gel","category":"Heath & Personal Care"},
            {"name":"Lip balm","category":"Heath & Personal Care"},
            {"name":"Moisturizing lotion","category":"Heath & Personal Care"},
            {"name":"Mouthwash","category":"Heath & Personal Care"},
            {"name":"Razors / Shaving cream","category":"Heath & Personal Care"},
            {"name":"Shampoo / Conditioner","category":"Heath & Personal Care"},
            {"name":"Sunblock","category":"Heath & Personal Care"},
            {"name":"Toilet paper","category":"Heath & Personal Care"},
            {"name":"Toothpaste","category":"Heath & Personal Care"},
            {"name":"Vitamins / Supplements","category":"Heath & Personal Care"},
            {"name":"Allergy Medicine","category":"Heath & Personal Care"},
            {"name":"Antibiotic","category":"Heath & Personal Care"},
            {"name":"Antidiarrheal","category":"Heath & Personal Care"},
            {"name":"Aspirin","category":"Heath & Personal Care"},
            {"name":"Antacid","category":"Heath & Personal Care"},
            {"name":"Bandages","category":"Heath & Personal Care"},
            {"name":"Pain reliever","category":"Heath & Personal Care"},
            {"name":"Air freshener","category":"Household & Cleaning"},
            {"name":"Bathroom cleaner","category":"Household & Cleaning"},
            {"name":"Dish Soap","category":"Household & Cleaning"},
            {"name":"Dishwasher Soap","category":"Household & Cleaning"},
            {"name":"Garbage bags","category":"Household & Cleaning"},
            {"name":"Glass cleaner","category":"Household & Cleaning"},
            {"name":"Vacuum Bags","category":"Household & Cleaning"},
            {"name":"Sponges","category":"Household & Cleaning"},
            {"name":"Bleach","category":"Household & Cleaning"},
            {"name":"Detergent","category":"Household & Cleaning"},
            {"name":"Baby food","category":"Baby"},
            {"name":"Diapers","category":"Baby"},
            {"name":"Formula","category":"Baby"},
            {"name":"Lotion","category":"Baby"},
            {"name":"Baby wash","category":"Baby"},
            {"name":"Wipes","category":"Baby"},
            {"name":"Juice","category":"Beverages"},
            {"name":"Sports Drink","category":"Beverages"},
            {"name":"Soda","category":"Beverages"},
            {"name":"Cake","category":"Bakery"},
            {"name":"Bagels","category":"Bakery"},
            {"name":"Buns / Rolls","category":"Bakery"},
            {"name":"Cookies","category":"Bakery"},
            {"name":"Pastries","category":"Bakery"},
            {"name":"Fresh Bread","category":"Bakery"},
            {"name":"Pie","category":"Bakery"},
            {"name":"Pita bread","category":"Bakery"},
            {"name":"Sliced bread","category":"Bakery"}
        ];
        vm.defaultSortOrder = ["Baby", "Bakery", "Beverages", "Breakfast & Cereal", "Condiments & Dressings", "Cooking & Baking", "Dairy", "Deli", "Frozen Foods", "Grains", "Health & Personal Care", "Household & Cleaning", "Meat", "Pet Supplies", "Produce", "Seafood", "Snacks", "Soups & Canned Goods", "Wine", "Office Supplies", "Hardware", "Sporting Goods", "Other"];
        vm.hideCompleted = false;

        vm.getSortIndex = function (item) {
            if(vm.currentList.selectedCategorySortOrder!=null&&vm.currentList.selectedCategorySortOrder.order.indexOf(item.category)!=-1){
                return vm.currentList.selectedCategorySortOrder.order.indexOf(item.category);
            } else
                return 1000;
        };

        var socket;

        $http.get('/api/me').success(function (data) {
            socket = io();
            console.log('/me route returned success');
            vm.me = data;
            console.log(data);
            socket.emit('user-connected',data);

            socket.on('connect', function () {
                console.log('socket connected');
            });
            socket.on('disconnect', function () {
                console.log('socket disconnected');
            });
            socket.on('lists-updated', function () {
                console.log('a change was made');
                refresh();
            });
            socket.on('list-created', function (data) {
                console.log('list created');
                console.log(data);
                refresh();
                //vm.all.push(data);
                //vm.currentList = vm.all[vm.all.length-1];
                //$scope.$apply();
            });

        });



        var refresh = function (listToSelect) {
            List.all().success(function (data) {
                console.log(data);
                vm.all = data;
                if(data.length>0) {
                    if(listToSelect!=null){
                        vm.selectList(listToSelect)
                    }else {
                        vm.selectList(currentListIndex);
                    }
                }
            });
        };
        refresh();


        vm.addList = function () {
            List.create({name:vm.newListName}).success(function (data) {
                console.log(data);
                if(data.success){
                    vm.newListName = '';
                }
            })
        };

        vm.delete = function (listId) {
            List.delete(listId).success(function (data) {
                if (data.success) {
                    for (var i = 0; i < vm.all.length; i++) {
                        if (vm.all[i]._id === listId)
                            vm.all.splice(i, 1);
                    }
                }
            })
        };

        vm.addItem = function () {
            console.log(vm.toAdd);
            if(typeof vm.toAdd == "object"){
                var item;
                if(vm.currentList.selectedCategorySortOrder==null||vm.currentList.selectedCategorySortOrder.order.indexOf(vm.toAdd.category)==-1){
                    item = {name: vm.toAdd.name};
                }else{
                    item = vm.toAdd;
                }
                List.addItem(vm.currentList._id,item).success(function (data) {
                    if(data.success){
                        vm.currentList.items = data.items;
                        vm.toAdd = '';
                    }
                })
            }else if(typeof vm.toAdd == "string"){
                List.addItem(vm.currentList._id,{name:vm.toAdd}).success(function (data) {
                    if(data.success){
                        vm.currentList.items = data.items;
                        vm.toAdd = '';
                    }
                });
            }
            console.log(typeof vm.toAdd);
        };

        vm.removeItem = function (itemId) {
            List.removeItem(vm.currentList._id,itemId).success(function (data) {
                console.log(data);
                if(data.success){
                    vm.currentList.items = data.items;
                }
            })
        };

        vm.toggleCompletion = function (item) {
            console.log({completed:item.completed});
            List.updateItem(vm.currentList._id, item._id, {completed:item.completed}).success(function (data) {
                console.log(data);
                if(data.success){
                    item = data.list;
                }
            })
        };

        vm.updateCategory = function (item) {
            console.log(item);
            List.updateItem(vm.currentList._id,item._id,{category:item.category}).success(function (data) {
                console.log(data);
            })
        };

        vm.selectList = function (index) {
            vm.currentList = vm.all[index];
            currentListIndex = index;
        }
    });