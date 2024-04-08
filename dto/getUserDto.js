const getUserDto = (model) => {
	return {
		userID: model._id,
		userName: model.userName,
		userEmail: model.userEmail,
	};
};

module.exports = getUserDto;
