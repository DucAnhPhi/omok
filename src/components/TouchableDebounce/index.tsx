import React from "react";
import { TouchableOpacity } from "react-native";

interface Props {
  children: any;
  style: any;
  onPress: () => void;
}

const debounce = (func: () => void, wait: number) => {
  let timeout: number;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(), wait);
  };
};

export default class TouchableDebounce extends React.Component<Props> {
  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        onPress={debounce(() => {
          this.props.onPress();
        }, 500)}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
