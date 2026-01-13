import jwt from 'jsonwebtoken';
import Operator from '../models/operator.js';

const tokenChecker = function(req, res, next) {
	let token = req.query.token || req.headers['x-access-token'];

	if (!token) {
		return res.status(401).send({
			message: 'No token provided.'
		});
	}

	jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {			
		if (err) {
			return res.status(403).send({
				message: 'Failed to authenticate token.'
			});
		} else {
			req.user = decoded;
			//controllo se è l'operatore è attivo
			if(req.user.role !== undefined){
				let operator= await Operator.findById(req.user.id).exec();
				if(!operator || !operator.isActive){
					return res.status(403).send({
						message: 'User inactive.'
					});
				}
			}
			next();
		}
	});
	
};

export default tokenChecker;