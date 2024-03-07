import {View, StyleSheet, Text, Platform, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import Accordion from '../../../components/Accordion';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../../../styles/styles';

const status = {
  receive_order: 'Can Receive',
  verify_purchase: 'Approval Pending',
};

const PODelivery = ({filteredPODeliveryData, project_id}) => {
  if (filteredPODeliveryData.length === 0) {
    return (
      <View style={styles.emptyTabView}>
        <Text>No PO with the given time range</Text>
      </View>
    );
  }
  const stocksAsObject__ = useSelector(state => state.stock.stocks);
  const stocksAsObject =
    (stocksAsObject__[project_id] && stocksAsObject__[project_id].asObject) ||
    {};

  const AccordionContent = ({item}) => {
    const unit =
      stocksAsObject[item.stock_id] && stocksAsObject[item.stock_id].unit;
    return (
      <View
        style={{
          height: 120,
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingBottom: 10,
        }}>
        <View style={{padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Card title="Status" content={status[item.status]} />
            <Card
              title="To be Received"
              content={`${item.quantity - item.received} ${unit}`}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Card title="Quantity" content={`${item.quantity} ${unit}`} />
            <Card title="Received" content={`${item.received} ${unit}`} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredPODeliveryData}
        renderItem={({item, index}) => {
          const stock =
            stocksAsObject[item.stock_id] && stocksAsObject[item.stock_id];
          return (
            <Accordion
              key={index}
              containerStyle={customStyles.accordioncontainer}
              contentHeight={130}
              header={
                <AccordionHeader
                  title={stock.name}
                  content={`${item.quantity} ${stock.unit}`}
                />
              }
              content={<AccordionContent item={item} />}
            />
          );
        }}
      />
    </View>
  );
};

const AccordionHeader = ({title, content}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
      }}>
      <View style={styles.assIcon}>
        <Feather name="activity" size={24} color="white" />
      </View>
      <View style={{width: '77%', marginLeft: 10}}>
        <Text
          style={{
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 2,
          }}>
          {title}
        </Text>
        <Text>{content}</Text>
      </View>
    </View>
  );
};

const Card = ({title, content}) => {
  return (
    <View style={{flex: 1}}>
      <Text
        numberOfLines={1}
        style={{color: '#666', fontSize: 12, marginBottom: 2}}>
        {title}
      </Text>
      <Text numberOfLines={1} style={{fontSize: 17, fontWeight: 600}}>
        {content}
      </Text>
    </View>
  );
};

const customStyles = StyleSheet.create({
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6, textAlign: 'center'},
  accordioncontainer: {
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default PODelivery;
