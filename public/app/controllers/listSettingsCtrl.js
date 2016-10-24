angular.module('listSettingsCtrl', ['listService','dndLists'])
    .controller('listSettingsController', function ($routeParams, List, $scope) {
        var vm = this;
        vm.list = null;
        vm.isCollapsed = true;
        vm.arrangeCollapsed = false;
        vm.selectedCategory = null;
        vm.nameUpdatedAlertVisible = false;
        vm.sortOrders = null;
        vm.currentSortOrder = null;
        vm.selectedCategorySortOrder = null;
        vm.categories = [];
        vm.sharingSuccessAlertVisible = false;
        vm.sharingErrorAlertVisible = false;

        var refresh = function () {
            //this is necessary to prevent duplicates
            vm.categories = [];

            //refresh the list that these settings are for
            List.get($routeParams.listId).success(function (data) {
                console.log(data);
                vm.list = data;

                //update all sort orders
                List.getAllSortOrders().success(function (data) {
                    console.log(data);
                    vm.sortOrders = data;

                    //update the selected sort order object

                        for(var i = 0;i<data.length;i++){
                            if(data[i]._id==vm.list.selectedCategorySortOrder._id){
                                vm.selectedCategorySortOrder = vm.sortOrders[i];
                            }
                        }
                    if(vm.selectedCategorySortOrder!=null){
                        vm.categories = vm.selectedCategorySortOrder.order.map(function (value) {
                            return({name:value});
                        });
                        console.log(vm.categories);
                    }
                });
            });
        };
        refresh();

        vm.selectSortOrder = function () {
            List.update($routeParams.listId,{selectedCategorySortOrder:vm.selectedCategorySortOrder._id});
            vm.categories = [];
            vm.categories = vm.selectedCategorySortOrder.order.map(function (value) {
                return({name:value});
            });
        };

        vm.addSortOrder = function () {
            List.createSortOrder('New Sort Order','["Baby", "Bakery", "Beverages", "Breakfast & Cereal", "Condiments & Dressings", "Cooking & Baking", "Dairy", "Deli", "Frozen Foods", "Grains", "Health & Personal Care", "Household & Cleaning", "Meat", "Pet Supplies", "Produce", "Seafood", "Snacks", "Soups & Canned Goods", "Wine", "Office Supplies", "Hardware", "Sporting Goods", "Other"]'
            ).success(function (data) {
                    console.log(data);
                    vm.sortOrders.push(data);
                    vm.selectedCategorySortOrder = vm.sortOrders[vm.sortOrders.length-1];
                    vm.selectSortOrder();
                })
        };

        vm.deleteSortOrder = function () {
            List.deleteSortOrder(vm.selectedCategorySortOrder._id).success(function (data) {
                console.log(data);
                refresh();
            })
        };

        vm.movedCallback = function (index) {
            vm.categories.splice(index, 1);
            var categoryArray = vm.categories.map(function (object) {
                return object.name;
            });
            List.updateSortOrder(vm.selectedCategorySortOrder._id,{order:JSON.stringify(categoryArray)}).success(function (data) {
                console.log(data);
            });
        };

        vm.updateListName = function () {
            List.update($routeParams.listId,{name:vm.list.name}).success(function (data) {
                console.log(data);
                vm.nameUpdatedAlertVisible = true;
                setTimeout(function () {
                    vm.nameUpdatedAlertVisible = false;
                    $scope.$apply();
                },1500);
            })
        };

        vm.addCategory = function () {
            vm.categories.splice(0,0,{name:vm.categoryToAdd});
            vm.categoryToAdd = '';
            var categoryArray = [];
            for(var i = 0;i<vm.categories.length;i++){
                categoryArray.push(vm.categories[i].name);
            }
            List.updateSortOrder(vm.selectedCategorySortOrder._id,{order:JSON.stringify(categoryArray)}).success(function (data) {
                console.log(data);
            });
        };

        vm.renameSortOrder = function () {
            //change the name in the database
            List.updateSortOrder(vm.selectedCategorySortOrder._id,{name:vm.selectedCategorySortOrder.name}).success(function (data) {
                if(data.success)
                    console.log('updated name');
                refresh();
            })
        };

        vm.deleteCategory = function (index) {
            vm.categories.splice(index,1);
            var categoryArray = vm.categories.map(function (object) {
                return object.name;
            });
            List.updateSortOrder(vm.selectedCategorySortOrder._id,{order:JSON.stringify(categoryArray)}).success(function (data) {
                console.log(data);
            });
        };

        vm.addShare = function () {
            vm.sharingSuccessAlertVisible = false;
            vm.sharingErrorAlertVisible = false;
            List.addShare(vm.list._id,vm.sharingEmailAddress).success(function (data) {
                console.log(data);
                if(data.success){
                    vm.sharingSuccessAlertText = data.message;
                    vm.sharingSuccessAlertVisible = true;
                }else{
                    vm.sharingErrorAlertText = data.message;
                    vm.sharingErrorAlertVisible = true;
                }
                refresh();
            })
        }

    });