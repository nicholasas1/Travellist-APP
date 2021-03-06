import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import { colorPrimary } from "../../../constants/styleConstants";
import { translations } from "../../../reducers/translations";
import { connect } from "react-redux";
const convertTime = (time) =>
  moment(time, "DD-MM-YYYY HH:mm:ss").format("MMMM DD, YYYY, H:mm:ss");

const checkTime = (i) => {
  return i < 10 ? "0" + i : i;
};

class CountDown extends PureComponent {
  static propTypes = {
    time: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    containerStyle: PropTypes.object,
  };

  static defaultProps = {
    containerStyle: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      message: "00 : 00 : 00",
      timeOut: true,
      hours: 0,
      days: 0,
      animation: new Animated.Value(0),
    };
  }

  _down = 0;

  _countDown = () => {
    const { message } = this.state;
    const { time, translations } = this.props;
    // const timing = convertTime(time);
    // let date = new Date(timing).getTime();
    const now = new Date().getTime();
    let distance = time - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));

    this._down =
      days > 1
        ? this.setState(
            {
              message: `${days} ${translations.days}`,
              days,
              timeOut: false,
            },
            () => this._setAnimation()
          )
        : setInterval(() => {
            const now = new Date().getTime();
            let distance = time - now;
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            let minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            hours = checkTime(days * 24 + hours);
            minutes = checkTime(minutes);
            seconds = checkTime(seconds);
            this.setState(
              {
                message: `${hours}: ${minutes} : ${seconds}`,
                timeOut: false,
                hours,
                days,
              },
              () => this._setAnimation()
            );

            if (distance < 0) {
              clearInterval(this._down);
              this.setState({
                timeOut: true,
              });
            }
          }, 1000);
  };

  _setAnimation = () => {
    const { animation } = this.state;
    Animated.timing(animation, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
    this.setState({
      timeOut: false,
    });
  };

  _getOpacity = () => {
    return this.state.animation.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
    });
  };

  componentDidMount() {
    const { time } = this.props;
    typeof time === "string" ? this._setAnimation() : this._countDown();
  }

  componentWillUnMount() {
    clearInterval(this._down);
  }

  render() {
    const { message, timeOut, hours, days } = this.state;
    return timeOut || !this.props.time ? null : typeof this.props.time ===
      "string" ? (
      <Text style={styles.time}>{this.props.time}</Text>
    ) : (
      <Animated.Text
        style={[styles.time, { opacity: days > 0 ? 1 : this._getOpacity() }]}
      >
        {message}
      </Animated.Text>
    );
  }
}
const styles = StyleSheet.create({
  times: {
    paddingHorizontal: 5,
    color: colorPrimary,
  },
});

const mapStateToProps = ({ translations }) => ({
  translations,
});

export default connect(mapStateToProps)(CountDown);
