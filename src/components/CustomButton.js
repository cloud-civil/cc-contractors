import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../styles/Colors';

export const CustomButton = ({children, onClick, buttonStyle, disabled}) => {
  const styles = {opacity: disabled ? 0.5 : 1, ...buttonStyle};
  return (
    <TouchableOpacity activeOpacity={0.5} disabled={disabled} onPress={onClick}>
      <View style={styles}>{children}</View>
    </TouchableOpacity>
  );
};

export const CustomFormButton = ({
  children,
  onClick,
  disabled,
  loading,
  style,
}) => {
  const styles = {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    height: 45,
    opacity: disabled ? 0.5 : 1,
    ...style,
  };
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled || loading}
      onPress={onClick}>
      <View style={styles}>
        {!loading ? children : <ActivityIndicator size={20} color={'white'} />}
      </View>
    </TouchableOpacity>
  );
};

export const CustomIconButton = ({
  children,
  onClick,
  disabled,
  loading,
  style,
}) => {
  const styles = {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginRight: 8,
    padding: 6,
    opacity: disabled ? 0.5 : 1,
    ...style,
  };
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled || loading}
      onPress={onClick}>
      <View style={styles}>
        {!loading ? (
          children
        ) : (
          <ActivityIndicator size={24} color={Colors.primary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export const CustomFormIconButton = ({
  children,
  onClick,
  disabled,
  style,
  loading,
}) => {
  const styles = {
    backgroundColor: Colors.primary,
    height: 45,
    width: 45,
    borderRadius: 10,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled || loading}
      onPress={onClick}>
      <View style={styles}>
        {!loading ? children : <ActivityIndicator size={24} color={'white'} />}
      </View>
    </TouchableOpacity>
  );
};
