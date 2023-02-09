var express = require('express');
var url = require('url');
var JSONDatabase = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');

const backend = express();
backend.use(bodyParser.json());
backend.use(cors());
backend.use(express.urlencoded({extended:true}));
var connectionPort = 8080;
  
backend.use('/',(request,response,next)=>{processQuery(url.parse(request.url, true).query,response)});
backend.listen(connectionPort);

var productDatabaseLocation = 'productDatabase.json';
var userDatabaseLocation = 'userDatabase.json';
var billDatabaseLocation = 'billDatabase.json';

function readDatabase(databaseLocation){
    return JSON.parse(JSONDatabase.readFileSync(databaseLocation));
};
function saveDatabase(databaseLocation, JSONToSave){
    JSONDatabase.writeFileSync(databaseLocation, JSON.stringify(JSONToSave));
};

function getAllProduct(response){
    var productDatabase = readDatabase(productDatabaseLocation);
    var responseMessage = {products: productDatabase, error: false, response: 'Productos leídos exitosamente.'};
    response.end(JSON.stringify(responseMessage));
};

function createProduct(requestQuery, response){
    var productDatabase = readDatabase(productDatabaseLocation);
    var productCodes = Object.keys(productDatabase);
    var productExists = false;
    for (var productCode of productCodes){
        if (requestQuery.productCode == productCode){
            productExists = true;
            break;
        }
    }
    if (!productExists){
        productDatabase[requestQuery.productCode] = {productName: requestQuery.productName, productPrice: requestQuery.productPrice};
        var responseMessage = {error: false, response: 'Producto creado exitosamente.'};
        saveDatabase(productDatabaseLocation, productDatabase);
    } else {
        var responseMessage = {error: true, response: 'Error. El código del producto ya existe. Intentelo nuevamente.'};
    }
    response.end(JSON.stringify(responseMessage));
};

function editProduct(requestQuery, response){
    var productDatabase = readDatabase(productDatabaseLocation);
    var productCodes = Object.keys(productDatabase);
    var productExists = false;
    for (var productCode of productCodes){
        if (requestQuery.productCode == productCode){
            productExists = true;
            break;
        }
    }
    if (productExists){
        productDatabase[requestQuery.productCode] = {productName: requestQuery.productName, productPrice: requestQuery.productPrice};
        var responseMessage = {error: false, response: 'Producto editado exitosamente.'};
        saveDatabase(productDatabaseLocation, productDatabase);
    } else {
        var responseMessage = {error: true, response: 'Error. El producto no existe. Intentelo nuevamente.'};
    }
    response.end(JSON.stringify(responseMessage));
};

function deleteProduct(requestQuery, response){
    var productDatabase = readDatabase(productDatabaseLocation);
    var productCodes = Object.keys(productDatabase);
    var deletedProductIndex = 0;
    var productExists = false;
    for (var productCode of productCodes){
        if (requestQuery.productCode == productCode){
            productExists = true;
            break;
        }
        deletedProductIndex = deletedProductIndex + 1;
    }
    if (productExists){
        delete productDatabase[requestQuery.productCode];
        var responseMessage = {error: false, response: 'Producto eliminado exitosamente.'};
        saveDatabase(productDatabaseLocation, productDatabase);
    } else {
        var responseMessage = {error: true, response: 'Error. El producto no existe. Intentelo nuevamente.'};
    }
    response.end(JSON.stringify(responseMessage));
};

function login(requestQuery, response){
    var userDatabase = readDatabase(userDatabaseLocation);
    if ((userDatabase.adminUsername==requestQuery.username) && (userDatabase.adminPassword==requestQuery.password)){
        var responseMessage = {error: false, response: 'Sesión iniciada exitosamente.'};
    } else {
        var responseMessage = {error: true, response: 'Error. Nombre de usuario o contraseña incorrecta. Intentelo nuevamente.'};
    }
    response.end(JSON.stringify(responseMessage));
};

function createBill(requestQuery, response){
    var billDatabase = readDatabase(billDatabaseLocation);
};

function getAllSellers(response){
    var userDatabase = readDatabase(userDatabaseLocation);
    var responseMessage = {sellers: userDatabase.sellers, error: false, response: 'Vendedores leídos exitosamente.'};
    response.end(JSON.stringify(responseMessage));
};

function processQuery(requestQuery, response){
    var queryType = requestQuery.queryType;
        if (queryType != undefined){
            if (queryType == 0){
                getAllProduct(response);
            } else if (queryType == 1){
                createProduct(requestQuery, response);
            } else if (queryType == 2){
                editProduct(requestQuery, response);
            } else if (queryType == 3){
                deleteProduct(requestQuery, response);
            } else if (queryType == 4){
                login(requestQuery, response);
            } else if (queryType == 5){
                createBill(requestQuery, response);
            } else if (queryType == 7){
                getAllSellers(response);
            }
    }
};