module.exports = {
  requireRole: function(role){
    return function(req,res,next){
      const user = req.user || {};
      if(!user || !user.role) return res.status(401).json({error:'unauthorized'});
      if(Array.isArray(role)? role.includes(user.role) : user.role === role || user.is_admin || user.is_superadmin) return next();
      return res.status(403).json({error:'forbidden'});
    }
  }
};
