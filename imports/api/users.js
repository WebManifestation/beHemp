import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Meteor.methods({
  'users.insertPicture'() {
 
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const user = Meteor.users.findOne(this.userId),
          profile = user.profile;

    if (user.services.facebook) {
      const picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
      profile.picture = picture;
      Meteor.users.update(
        {_id: user._id},
        {$set: { profile }}
      ) 
    }

    if (user.services.google) {
      const picture = user.services.google.picture;
      profile.picture = picture;
      Meteor.users.update(
        {_id: user._id},
        {$set: { profile }}
      ) 
    }

    if (user.services.twitter) {
      const pictureSmall = user.services.twitter.profile_image_url;
      const picture = pictureSmall.slice(0,-12) + '.jpeg';
      profile.picture = picture;
      Meteor.users.update(
        {_id: user._id},
        {$set: { profile }}
      ) 
    }
  },

});