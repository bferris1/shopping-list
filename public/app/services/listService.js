angular.module('listService', [])

    .factory('List', function ($http) {
        var listFactory  = {};

        listFactory.get = function (id) {
            return $http.get('/api/lists/' + id);
        };

        listFactory.all = function () {
            return $http.get('/api/lists');
        };

        listFactory.create = function (listData) {
            return $http.post('/api/lists', listData);
        };

        listFactory.addItem = function (listId, itemData) {
            return $http.post('/api/lists/' + listId, itemData);
        };

        listFactory.removeItem = function (listId, itemId) {
            return $http.delete('/api/lists/'+ listId +'/items/' + itemId);
        };

        listFactory.updateItem = function (listId, itemId, itemData) {
            return $http.put('/api/lists/' +listId + '/items/'+ itemId, itemData);
        };

        listFactory.delete = function (id) {
            return $http.delete('/api/lists/' + id);
        };

        listFactory.update = function (listId, listData) {
            return $http.put('/api/lists/' + listId, listData);
        };
        listFactory.getSortOrder = function (id) {
            return $http.get('/api/orders/' + id);
        };
        listFactory.getAllSortOrders = function () {
            return $http.get('/api/orders/');
        };
        listFactory.createSortOrder = function (name, orderArray) {
            return $http.post('/api/orders/',{name:name, order:orderArray});
        };
        listFactory.updateSortOrder = function (id, data) {
            return $http.put('/api/orders/'+id, data);
        };
        listFactory.deleteSortOrder = function (id) {
            return $http.delete('/api/orders/'+id);
        };
        listFactory.addShare = function (listId, emailAddress) {
            return $http.post('/api/sharing/'+listId,{email:emailAddress})
        };
        listFactory.removeShare = function (listId, personId) {
            return $http.delete('/api/sharing/'+listId+'/'+personId);
        };

        return listFactory;
    });