const sequelize = require('sequelize');


const connection = new sequelize('guiPerguntas', 'root','0139Sm12Dc',{
    host:'localhost',
    dialect:'mysql'
});

module.exports = connection;