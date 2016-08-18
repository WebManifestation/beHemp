import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  requestPermissions: {
    facebook: ['email'],
  },
  passwordSignupFields: 'USERNAME_ONLY',
});