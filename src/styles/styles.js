import {Dimensions, Platform, StyleSheet} from 'react-native';
import Colors from './Colors';

export const stylesv1 = StyleSheet.create({
  button: {
    backgroundColor: '#4da6ff',
    color: 'white',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 3,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  statusBar: {
    paddingTop: 44,
  },
  headerContainer: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  projectCard: {
    width: 180,
    height: 120,
    marginRight: 10,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    padding: 12,
    overflow: 'hidden',
  },
  projectCardHeading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2d2d2d',
  },
  card: {
    width: Dimensions.get('window').width - 24,
    // marginRight: 8,
    // marginHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 8,
    // overflow: 'hidden',
    backgroundColor: 'white',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 8 : 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardBorder: {
    width: Dimensions.get('window').width - 24,
    marginHorizontal: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomColor: '#ccc',
  },
  assIcon: {
    width: Dimensions.get('window').width * 0.1,
    height: Dimensions.get('window').width * 0.1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 4,
    borderRadius: 8,
  },
  cardContent: {
    marginLeft: 10,
    width: Dimensions.get('window').width * 0.8 - 30,
  },
  cardContentHeader: {
    marginBottom: 2,
    fontWeight: '600',
    fontSize: 16,
  },
  cardButton: {
    width: Dimensions.get('window').width * 0.1,
  },
  heading: {
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
    marginHorizontal: 4,
    paddingVertical: 5,
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    height: 40,
  },
  inputField: {
    marginBottom: 10,
    width: '100%',
    fontSize: 14,
    borderRadius: 30,
    backgroundColor: 'white',
    paddingVertical: 0,
  },
  inputLabel: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: 'white',
    flex: 0,
    paddingHorizontal: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    marginBottom: 10,
    alignItems: 'flex-start',
    borderColor: '#bbb',
    backgroundColor: 'white',
  },
  dateLabel: {
    backgroundColor: 'white',
    marginTop: -10,
    left: 10,
    paddingHorizontal: 6,
    fontSize: 12,
    color: '#2d2d2d',
  },
  date: {
    marginTop: 8,
    marginLeft: 10,
    color: '#2d2d2d',
  },
  dropdownButtonStyle: {
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 0.7,
    borderColor: '#bbb',
    width: '100%',
    marginTop: 5,
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#4b4b4b',
    textAlign: 'left',
  },
  emptyTabView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: '86%',
  },
  tag: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 3,
  },
  horizontalBar: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
  },
});

export default styles;
