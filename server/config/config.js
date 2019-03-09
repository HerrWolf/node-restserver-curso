// =======================================
//  Puerto                               =
// =======================================
process.env.PORT = process.env.PORT || 8080;

// =======================================
//  Entorno                              =
// =======================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =======================================
//  Vencimiento del Token                =
// =======================================
// 60 segundo
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '30 days';

// =======================================
//  SEED                                 =
// =======================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =======================================
//  Base de Datos                        =
// =======================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;

// =======================================
//  Google ClientID                      =
// =======================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '672985579240-upvpbsqjeul4vo7o4h80ngsast8qn46j.apps.googleusercontent.com';