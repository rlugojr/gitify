import React from 'react';
import { connect } from 'react-redux';

const ipcRenderer = window.require('electron').ipcRenderer;
const shell = window.require('electron').shell;

import { fetchNotifications, logout } from '../actions';
import Constants from '../utils/constants';

export class Sidebar extends React.Component {
  componentDidMount() {
    var self = this;
    var iFrequency = 60000;
    var myInterval = 0;
    if (myInterval > 0) { clearInterval(myInterval); }
    setInterval( function () {
      self.refreshNotifications();
    }, iFrequency );
  }

  refreshNotifications() {
    const isLoggedIn = this.props.token !== null;
    if (isLoggedIn) {
      this.props.fetchNotifications();
    }
  }

  goToSettings() {
    this.context.router.push('/settings');
  }

  goBack() {
    this.context.router.push('/notifications');
  }

  appQuit() {
    ipcRenderer.send('app-quit');
  }

  openBrowser() {
    shell.openExternal(`http://www.github.com/${Constants.REPO_SLUG}`);
  }

  render() {
    const isLoggedIn = this.props.token !== null;
    var refreshIcon, settingsIcon, countLabel;

    if (isLoggedIn) {
      refreshIcon = (
        <li className="nav-item">
          <i title="Refresh" className={'nav-link fa fa-refresh'} onClick={() => this.refreshNotifications()} />
        </li>
      );
      settingsIcon = (
        <li className="nav-item">
          <i title="Settings" className="nav-link fa fa-cog" onClick={() => this.goToSettings()} />
        </li>
      );
      if (!this.props.notifications.isEmpty()) {
        countLabel = (
          <span className="tag tag-success">{this.props.notifications.size}</span>
        );
      }
    }

    if (this.props.location.pathname === '/settings') {
      settingsIcon = (
        <li className="nav-item">
          <i title="Settings" className="nav-link fa fa-cog" onClick={() => this.goBack()} />
        </li>
      );
    }

    return (
      <div className="sidebar-wrapper bg-inverse">
        <img
          className="img-fluid logo"
          src="images/gitify-logo-outline-light.png"
          onClick={this.openBrowser} />
        {countLabel}

        <ul className="nav navbar-nav pull-xs-right">
          {refreshIcon}
          {settingsIcon}
        </ul>

        <div className="footer">

          {!this.props.hasStarred ? (
            <button className="btn btn-sm btn-outline-secondary btn-star" onClick={this.openBrowser}>
              <i className="fa fa-github" /> Star
            </button>
          ) : null}
        </div>
      </div>
    );
  }
};

Sidebar.contextTypes = {
  location: React.PropTypes.object,
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    hasStarred: state.settings.get('hasStarred'),
    notifications: state.notifications.get('response'),
    token: state.auth.get('token')
  };
};

export default connect(mapStateToProps, { fetchNotifications, logout })(Sidebar);