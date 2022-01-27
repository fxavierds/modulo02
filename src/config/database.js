require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'xavier',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
