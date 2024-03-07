import {setReceiveOrders, setPurchaseOrders} from 'cc-hooks/appSlice';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {axiosInstance} from '../../../../apiHooks/axiosInstance';
import {setStocks} from '../../../../cc-hooks/src/stockSlice';

const token = useSelector(state => state.auth.token);

export const deleteOrder = (rorder, allProps) => {
  const {
    userOrg,
    project_id,
    dispatch,
    receivedOrders,

    setDeleteItem,
    stocksAsArray,
    purchasedOrders,
  } = allProps;

  if (rorder.status === 'verified') {
    return axiosInstance(token)
      .post('/deleteVerifiedReceivedOrder', {
        project_id,
        org_id: userOrg.org_id,
        rorder_id: rorder.rorder_id,
        stock_id: rorder.stock_id,
        quantity: rorder.quantity,
        porder_id: rorder.porder_id,
      })
      .then(() => {
        const stocksAsObject = {};
        const stocksArray = stocksAsArray.map(s => {
          if (s.stock_id === rorder.stock_id) {
            const f = {...s, total: s.total - rorder.quantity};
            stocksAsObject[s.stock_id] = f;
            return f;
          }
          stocksAsObject[s.stock_id] = s;
          return s;
        });
        dispatch(
          setStocks({
            project_id,
            data: {
              asArray: stocksArray,
              asObject: stocksAsObject,
            },
          }),
        );
        dispatch(
          setPurchaseOrders({
            project_id,
            data: purchasedOrders.map(r => {
              if (r.porder_id === rorder.porder_id) {
                return {
                  ...r,
                  received: r.received - rorder.quantity,
                };
              }
              return r;
            }),
          }),
        );
        dispatch(
          setReceiveOrders({
            project_id,
            data: receivedOrders.filter(r => r.rorder_id !== rorder.rorder_id),
          }),
        );

        setDeleteItem(null);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Order deleted succesfully.',
        });
      })
      .catch(err => {
        setDeleteItem(null);
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: err.response.data.message,
        });
        console.log('/deleteVerifiedReceivedOrder', err);
      });
  }
  axiosInstance(token)
    .post(`/${rorder.rorder_id}/deleteReceivedOrderById`, {
      project_id,
      org_id: userOrg.org_id,
    })
    .then(() => {
      dispatch(
        setReceiveOrders({
          project_id,
          data: receivedOrders.filter(r => r.rorder_id !== rorder.rorder_id),
        }),
      );

      setDeleteItem(null);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Deleted receive order succesfully.',
      });
    })
    .catch(err => {
      setDeleteItem(null);
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: err.response.data.message,
      });
      console.log('/deleteReceivedOrderById', err);
    });
};

export const verifyReceiveOrder = (verifyOrder, allProps, setVerifyItem) => {
  const {
    authUser,
    receivedOrders,
    purchasedOrders,
    project_id,
    setPoState,
    dispatch,
    stocksAsArray,
  } = allProps;

  const __data = {
    update_stocks: true,
    stock_id: verifyOrder.stock_id,
    rorder_quantity: verifyOrder.quantity,
    project_id: verifyOrder.project_id,
    rorder_id: verifyOrder.rorder_id,
    porder_id: verifyOrder.porder_id,
    verification: JSON.stringify({
      verified: true,
      verified_by: authUser.user_id,
    }),
  };
  axiosInstance(token)
    .post('/verifyOrderByReceiveId', __data)
    .then(({data}) => {
      const {totalReceived} = data;
      dispatch(
        setReceiveOrders({
          project_id,
          data: receivedOrders.map(r => {
            if (r.rorder_id === verifyOrder.rorder_id) {
              return {
                ...r,
                status: 'verified',
                verification: JSON.stringify({
                  verified: true,
                  verified_by: authUser.user_id,
                }),
              };
            }
            return r;
          }),
        }),
      );
      const stocksAsObject = {};
      const stocksArray = stocksAsArray.map(s => {
        if (s.stock_id === verifyOrder.stock_id) {
          const f = {...s, total: verifyOrder.quantity + s.total};
          stocksAsObject[s.stock_id] = f;
          return f;
        }
        stocksAsObject[s.stock_id] = s;
        return s;
      });
      dispatch(
        setStocks({
          project_id,
          data: {
            asArray: stocksArray,
            asObject: stocksAsObject,
          },
        }),
      );
      dispatch(
        setPurchaseOrders({
          project_id,
          data: purchasedOrders.map(r => {
            if (r.porder_id === verifyOrder.porder_id) {
              return {
                ...r,
                received: totalReceived,
              };
            }
            return r;
          }),
        }),
      );
      setPoState(prevState => ({
        ...prevState,
        activeOrder: prevState.activeOrder.map(x => {
          if (x.rorder_id === verifyOrder.rorder_id) {
            return {
              ...x,
              status: 'verified',
              verification: JSON.stringify({
                verified: true,
                verified_by: authUser.user_id,
              }),
            };
          }
          return x;
        }),
      }));
      setVerifyItem(null);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Receive Order Verified Succesfully.',
      });
    })
    .catch(err => {
      Toast.show({
        type: 'success',
        text1: 'Failed',
        text2: err.response.data.message,
      });
      console.log(err);
    });
};
