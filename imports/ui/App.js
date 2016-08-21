import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Meteor } from 'meteor/meteor';

// import { Tasks } from '../api/tasks';
// import { Users } from '../api/users';

import Task from './Task';

import AccountsUIWrapper from './AccountsUIWrapper';

// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginInProgerss: false,
      // hideCompleted: false,
    };
  }

  // toggleHideCompleted() {
  //   this.setState({
  //     hideCompleted: !this.state.hideCompleted,
  //   });
  // }

  // handleSubmit(event) {
  //   event.preventDefault();

  //   // Find the text field via the React ref
  //   const text = this.refs.textInput.value.trim();

  //   Meteor.call('tasks.insert', text);

  //   // Clear form
  //   this.refs.textInput.value = '';
  // }
  

  // renderTasks() {
  //   let filteredTasks = this.props.tasks;
  //   if (this.state.hideCompleted) {
  //     filteredTasks = filteredTasks.filter(task => !task.checked);
  //   }
  //   return filteredTasks.map((task) => {
  //     const currentUserId = this.props.currentUser && this.props.currentUser._id;
  //     const showPrivateButton = task.owner === currentUserId;

  //     return (
  //       <Task
  //       key={task._id}
  //       task={task}
  //       showPrivateButton={showPrivateButton}
  //       />
  //       );
  //   });
  // }

  handleFbLogin() {

    this.refs.googleLogo.style.display = 'none';
    this.refs.twitterLogo.style.display = 'none';

    this.setState({loginInProgerss: true});

    Meteor.loginWithFacebook({},(err)=>{

      this.refs.googleLogo.style.display = 'inline';
      this.refs.twitterLogo.style.display = 'inline';

      this.setState({loginInProgerss: false});

    });
  }

  handleGoogleLogin() {

    this.refs.fbLogo.style.display = 'none';
    this.refs.twitterLogo.style.display = 'none';

    this.setState({loginInProgerss: true});

    Meteor.loginWithGoogle({},(err)=>{

      this.refs.fbLogo.style.display = 'inline';
      this.refs.twitterLogo.style.display = 'inline';

      this.setState({loginInProgerss: false});
    });
  }

  handleTwitterLogin() {

    this.refs.googleLogo.style.display = 'none';
    this.refs.fbLogo.style.display = 'none';

    this.setState({loginInProgerss: true});
    
    Meteor.loginWithTwitter({},(err)=>{

      this.refs.googleLogo.style.display = 'inline';
      this.refs.fbLogo.style.display = 'inline';

      this.setState({loginInProgerss: false});

    });
  }

  handleLogout() {
    Meteor.logout();
  }

  renderDashboard() {

    const profileName = this.props.currentUser.profile.name,
      profileImage = this.props.currentUser.profile.picture;

    if (!profileImage) {
      Meteor.call('users.insertPicture');
    }

    return (
      <div>
        <div>Dashboard</div>
        <div><img src={profileImage} alt={profileName}/></div>
        <div>{profileName}</div>
        <div onClick={this.handleLogout}>Logout</div>
      </div>
    )
  }

  renderLogin() {

    const css = {
      info:{
        position: 'absolute',
        top:0,
        right: 0,
        fontSize:13,
        padding:4,
      },
      fbLogo:{
        color: '#3b5998',
        fontSize: 64,
        padding: 16
      },
      googleLogo:{
        color: '#dd4b39',
        fontSize: 64,
        padding: 16
      },
      twitterLogo:{
        color: '#0084b4',
        fontSize: 64,
        padding: 16
      },
      splash: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: window.innerHeight,
      },
      table: {
        display: 'table',
        width: '100%',
        height: '100%'
      },
      cell: {
        display: 'table-cell',
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      loginText: {
        fontSize: 13,
        lineHeight: 1.5,
        padding: '0 16px'
      }
    }

    return (
      <div style={css.splash}>
        <div style={css.info}>
          { (this.state.loginInProgerss) ?
              '':
              <div><i className="fa fa-info-circle" aria-hidden="true"></i> Stop reading this and login already!</div>
          }
        </div>
        <div style={css.table}>
          <div style={css.cell}>
            <i ref="fbLogo" onClick={this.handleFbLogin.bind(this)} style={css.fbLogo} className="fa fa-facebook-official" aria-hidden="true"></i>
            <i ref="googleLogo" onClick={this.handleGoogleLogin.bind(this)} style={css.googleLogo} className="fa fa-google-plus-official" aria-hidden="true"></i>
            <i ref="twitterLogo" onClick={this.handleTwitterLogin.bind(this)} style={css.twitterLogo} className="fa fa-twitter" aria-hidden="true"></i><br/>
            <div ref="loginText" style={css.loginText}>
              { (this.state.loginInProgerss) ?
                <div>Loging you in&hellip;</div>:
                <div><i className="fa fa-hand-pointer-o" aria-hidden="true"></i> Login using the one that gives you your daily social media fix</div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {

    return(
      <div>
        { (this.props.currentUser) ? this.renderDashboard() : this.renderLogin() }
      </div>
    )
  }
}

App.propTypes = {
  // tasks: PropTypes.array.isRequired,
  // incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    // tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  };
}, App);