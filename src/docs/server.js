const rest_docs = require('rest-docs');
var rest = new rest_docs();

rest.startServer({
  ip: '127.0.0.1', //<-- YOUR_SERVER_IP
  port: '8081', //<-- YOUR_SERVER_PORT
  compression: 'gzip' //<-- YOUR_COMPRESSION_STRATEGY
})

rest.startDBServer('mysql', {
  host: process.env.DB_HOST, //<-- YOUR_DATABASE_HOST
  port: process.env.DB_PORT, //<-- YOUR_DATABASE_PORT
  user: process.env.DB_USER, //<-- YOUR_DATABASE_USER
  password: process.env.DB_PW, //<-- YOUR_DATABASE_PASSWORD
  database: process.env.DB_NAME, //<-- YOUR_DATABASE_NAME
  timezone: '+09:00' //<-- YOUR_DATABASE_TIMEZONE
});

const api_config = {
  base: '/api',
  pages: {
    docs: true, //<-- Expose PAGE: /{{base}}/docs
    monitor: true //<-- Expose PAGE: /{{base}}/monitor
  },
  routes: {
    tb: [
      {
        table: 'doctors', //<-- YOUR_TABLE_NAME
        event: 'DOCTOR', //<-- YOUR_EVENT_NAME
        methods: ['GET', 'POST', 'PUT', 'DELETE'], //<-- YOUR_METHODS
        //Used only by methods 'POST' and 'PUT'
        columns: [
          {name: 'id', primary: true},
          {name: 'name'},
          {name: 'specialty'},
          {name: 'address'},
          {name: 'photo'}
        ]
      }
    ]
  }
}

rest.buildRoutes(api_config)