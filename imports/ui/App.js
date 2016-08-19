import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks';
 
import Task from './Task';

import AccountsUIWrapper from './AccountsUIWrapper';
 
// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  
    // Find the text field via the React ref
    const text = this.refs.textInput.value.trim();
  
    Meteor.call('tasks.insert', text);
  
    // Clear form
    this.refs.textInput.value = '';
  }
  

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
 
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
 
  render() {

    const css = {
      loginIcon: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        color: '#fff',
        fontSize: 34,
        padding: 8,
      },
      splash: {
        color: 'white',
        position: 'absolute',
        top: 50,
        left: 0,
        width: '100%',
        height: window.innerHeight - 50,
        fontFamily: 'monospace'
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
      }
    }

    console.log(this.props.currentUser);

    return (
      <div>
        <div id="login-wrapper">
          <AccountsUIWrapper/>
          <i style={css.loginIcon} className="fa fa-user" aria-hidden="true"></i>
        </div>
        <div style={css.splash}>
          <div style={css.table}><div style={css.cell}>
          {(this.props.currentUser) ? 'Hello ' + this.props.currentUser.profile.name : 'You need to login!'}
          </div></div>
        </div>
      </div>
      /*<div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper/>
          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
          }
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>*/
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);