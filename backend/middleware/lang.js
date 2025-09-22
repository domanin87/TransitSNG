module.exports = function(req, res, next){
  let lang = 'ru';
  if(req.query && req.query.lang) lang = req.query.lang;
  else if(req.headers['accept-language']){
    const al = req.headers['accept-language'].split(',')[0];
    if(al.startsWith('kk')) lang='kk'; else if(al.startsWith('en')) lang='en'; else lang='ru';
  }
  req.lang = lang;
  next();
};
