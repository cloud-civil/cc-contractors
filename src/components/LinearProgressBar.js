import {View} from 'react-native';

const LinearProgressBar = ({
  progress,
  width,
  height,
  color,
  backgroundColor,
}) => {
  const styles = {
    progressStyle: {
      width: (width / 100) * progress,
      height: height,
      backgroundColor: color ? color : 'black',
      borderRadius: 50,
    },
    progressBarStyle: {
      width: width,
      height: height,
      backgroundColor: backgroundColor ? backgroundColor : '#ccc',
      borderRadius: 50,
    },
  };

  return (
    <View style={styles.progressBarStyle}>
      <View style={styles.progressStyle} />
    </View>
  );
};

export default LinearProgressBar;
