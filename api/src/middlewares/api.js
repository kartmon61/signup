exports.checkSession = () => 
  async (req, res, next) => {      
    if (req.session.userInfo === undefined) {      
      res.status(401)
      res.json({message: '인증이 되지 않은 요청입니다.'});
    } else {      
      next();
    } 
  }

exports.api = (controller) => {
  return (req, res, next) => {
    controller(req, res).then((data) => {
        if (data != undefined || data != null) {
            res.status(200);
            res.json(data);
        }
    }).catch(error => {
      try {
        if (Array.isArray(error) 
          && error.length === 2 
          && Number.isInteger(error[0]) 
          && error[0] >= 400 
          && error[0] < 600) {
            res.status(error[0])
            if (typeof error[1] === 'string') {
              res.json({message: error[1]});
            } else if (typeof error[1] === 'object' && error[1] !== undefined) {
              res.json(error[1]);
            } else {
              res.json({message:'에러가 발생했습니다.'});
            }
        } else {
          const stack = error.stack.split('\n').map(item => item.trim())
          console.error({type: 2, message: error[1], status: 500, stack})
          res.status(500)
          next({message: error.message})
        }
      } catch (error) {
        res.status(500);
        next({message: error + ''})
      }
        
    });
  };
};