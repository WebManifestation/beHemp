import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  requestPermissions: {
    facebook: ['email','public_profile','user_likes'],
  },
  passwordSignupFields: 'USERNAME_ONLY',
});