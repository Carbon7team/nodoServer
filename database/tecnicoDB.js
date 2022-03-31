const knex = require('../config/knex')

async function getTecnicoLogin(email,password){
  console.log(email);
  console.log(password);
    return await knex.select('Tecnici.idTecnico', 'Tecnici.nome', 'Tecnici.cognome')
    .from('Tecnici')
    .join('LoginTecnico', 'LoginTecnico.tecnico', 'Tecnici.idTecnico')
    .where({
      email: email,
      password:  password
    });
    //return await knex.select().table('Tecnici');
  }

  
module.exports = {
  getTecnicoLogin
};