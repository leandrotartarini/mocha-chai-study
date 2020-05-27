const env = process.env.NODE_ENV || 'dev';

const config = () => {
  switch (env) {
    case 'dev':
      return {
        bd_string: 'mongodb://mongo/node_api',
        jwt_pass: 'leandro',
        jwt_expires_in: '7d'
      };

    case 'hml':
      return {
        bd_string: 'mongodb://mongo/node_api'
      };

    case 'prod':
      return {
        bd_string: 'mongodb://mongo/node_api'
      };
  };
};

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`);

module.exports = config();