let RoleEdit = require('./RoleEdit.js');

class RoleAdd extends RoleEdit {
	constructor(text){
		super("roleadd", "Assigns a game role(s) to your user.", ["role1 [role2 role3 role4...]"], true, false);
	}

	action(params, msg, client) {
		// If no role has been given, remind user how to use command
		if(params.length < 1) {
			msg.channel.send(this.genHelp(msg));
		}
		// If roles are given, try assigning given roles
		else {
			// member.addRole promise returns
			// success 			success
			// already there 	success
			// not a role 		TypeError
			// permissions 		DiscordAPIError: Missing Permissions

			let promises = [];
			let roleSuccess = [];
			let roleFail = [];
			let roleMissingPerm = [];
			let roleNotFound = [];

			// chose not to use member.addRoles as member.addRole is more flexible and will assign roles even if one fails
			for(const role of params) {
				let searchedRole = msg.guild.roles.find(val => val.name.toLowerCase() == role.toLowerCase());

				// Could not find role
				if(!searchedRole) {
					roleNotFound[roleNotFound.length] = role;
					continue;
				}

				// Member already has role
				if(msg.member.roles.get(searchedRole.id)) {
					roleFail[roleFail.length] = searchedRole.name;
					continue;
				}

				// Try to add role to member
				promises[promises.length] = msg.member.addRole(searchedRole)
				.then(function() {
					roleSuccess[roleSuccess.length] = searchedRole.name;
				})
				.catch(function (err) {
					// if the role doesnt exist, alert user. Moved above member role search as computer dont like null.id :(
					// if(err.name == "TypeError") {}

					// if role is of a higher or equivelent rank to botty, alert user
					if(err.name == "DiscordAPIError") {
						roleMissingPerm[roleMissingPerm.length] = searchedRole.name;
					}
				});
			}

			Promise.all(promises)
			.then(values => {
				if(params.length == 1) {
					msg.channel.send(this.genSingleResponse(roleSuccess, roleFail, roleMissingPerm, roleNotFound, msg, client));
				}
				else {
					msg.channel.send(this.genCompressedResponse(roleSuccess, roleFail, roleMissingPerm, roleNotFound, msg, client));
				}
			});
		}
	}
}

module.exports = RoleAdd;