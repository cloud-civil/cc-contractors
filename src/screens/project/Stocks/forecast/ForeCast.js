import React, {useState} from 'react';
import {Text, View} from 'react-native';
import styles from '../../../../styles/styles';
import Tabs from '../../../../components/Tabs';

const tabs = ['Required', 'Received'];

const ForeCast = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <View style={{paddingHorizontal: 10}}>
      <Tabs
        data={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        numOfTab={3.5}
        minusWidth={0}
      />
      <View style={{paddingTop: 10}}>
        <Text>{activeTab}</Text>
      </View>
    </View>
  );
};

export default ForeCast;
