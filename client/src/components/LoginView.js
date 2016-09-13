'use strict';

import React from 'react';
import TransitionGroup from "react-addons-css-transition-group";
import NetworkStore from 'stores/NetworkStore';
import NetworkActions from "actions/NetworkActions";
import BackgroundAnimation from 'components/BackgroundAnimation';
import Themes from 'app/Themes';
import 'styles/LoginView.scss';

var maxNicknameLength = 32;
var maxLogoSize = 320;

const defaultNetworkHost = window.DEV ? '178.62.241.75:3333' : '178.62.241.75:3333'; // localhost or dev network

class LoginView extends React.Component{
  constructor(props) {
    super(props);
    this.state = this._getInitialState(props);
  }

  _getInitialState(props) {
    return {
      error: props ? props.meta : null,
      connecting: false,
      connected: false,
      username: null,
      password: null,
      displayPasswordField: false,
      currentLength: null,
      theme: Themes.Default,
      logoSize: Math.min(window.innerWidth, maxLogoSize)
    };
  }

  componentDidMount() {
    // window.addEventListener('resize', this.onResize.bind(this));

    if(this.refs.username) this.refs.username.focus();

    this.unsubscribeFromNetworkStore = NetworkStore.listen(this.onNetworkUpdated.bind(this));

    NetworkActions.registerError.listen((err) => {
      if(err.toString().replace(/\"/g, "") === "Invalid username or password")
        this.setState({ error: err.toString().replace(/\"/g, ""), connecting: false, displayPasswordField: true });
      else
      this.setState({ error: err.toString().replace(/\"/g, ""), connecting: false });
    });
  }

  onNetworkUpdated(network) {
    if(network) {
      this.setState({ error: null, connecting: false, connected: true });
    } else {
      this.setState(this._getInitialState());
    }
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.onResize.bind(this));
    this.unsubscribeFromNetworkStore();
  }

  componentDidUpdate() {
    if(this.refs.password) this.refs.password.focus();
  }

  // onResize() {
  //   var size = Math.min(window.innerWidth, maxLogoSize);
  //   this.setState({ logoSize: size });
  // }

  register(e) {
    if(e) e.preventDefault();
    var network  = this.refs.network.value.trim();
    var username = this.refs.username.value.trim();
    var password = this.refs.password.value.trim();

    if(network !== '' && username !== '') {
      this.setState({ error: null, connecting: true, username: username, password: password });
      NetworkActions.connect(network, username);
    }

    return;
  }

  calculateNicknameLength() {
    var remainingCharacters = maxNicknameLength - this.refs.username.value.length;
    this.setState({ currentLength: remainingCharacters < maxNicknameLength ? maxNicknameLength - this.refs.username.value.length : null });
  }

  onUportLogin() {
    const network = this.refs.network.value.trim()
    NetworkActions.connect(network, { provider: 'uPort' })
  }

  render() {
    if(this.state.connected)
      return (<div></div>);

    // var color = "rgba(100, 48, 128, 0.5)";
    var color = "rgba(180, 180, 180, 0.5)";
    var errorMsg   = this.state.error ? <div className="error">{this.state.error}</div> : "";
    var passwordFieldStyle = this.state.displayPasswordField ? "row" : "hidden";

    var form = !this.state.connecting ? (
      <TransitionGroup transitionName="loginScreenAnimation" transitionAppear={true} component="div" className="inputs" transitionAppearTimeout={5000} transitionEnterTimeout={5000} transitionLeaveTimeout={5000}>
        <div className="row hidden">
          <span className="label">Network</span><input type="text" ref="network" defaultValue={defaultNetworkHost} style={this.state.theme}/>
        </div>
        <div className="row">
          <span className="label">Login</span>
          <input
            type="text"
            ref="username"
            defaultValue={this.state.username ? this.state.username : ""}
            maxLength="32"
            autoFocus
            style={this.state.theme}
            onChange={this.calculateNicknameLength.bind(this)}/>
          {this.state.currentLength != null ? <span className="nicknameLength">{this.state.currentLength}</span> : ""}
        </div>
        <div className={passwordFieldStyle}>
          <span className="label">Password</span>
          <input type="password" ref="password" placeholder={this.state.password ? "" : "..."} defaultValue={this.state.password ? this.state.password : ""}/>
        </div>
        <div className="row">
          <input type="submit" value="Connect" style={this.state.theme}/>
        </div>
        <div className="row">
          {errorMsg}
        </div>
        <div className="row lastrow">
          <img
            onClick={this.onUportLogin.bind(this)}
            className="logo"
            src="images/uport.png"
            height="48"
          />
        </div>

      </TransitionGroup>
    ) : (<span></span>);

    return (
      <div className="LoginView">
        <form onSubmit={this.register.bind(this)} style={{ marginTop: (this.state.logoSize / 2 - 83)}}>
          <TransitionGroup className="row" transitionName="loginHeaderAnimation" transitionAppear={true} component="div" transitionAppearTimeout={5000} transitionEnterTimeout={5000} transitionLeaveTimeout={5000}>
            <h1>Captain's Log</h1>
          </TransitionGroup>
          {form}
        </form>
      </div>
    );
  }

}

export default LoginView;
