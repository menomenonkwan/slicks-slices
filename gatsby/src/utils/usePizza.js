import { useContext, useState } from 'react';
import OrderContext from '../components/OrderContext';
import attachNamesAndPrices from './attachNamesAndPrices';
import calculateOrderTotal from './calculateOrderTotal';
import formatMoney from './formatMoney';

export default function usePizza({ pizzas, values }) {
  // 1. create some state to hold order
  // we got rid of following line because we moved useState up to the proveder
  // Now we access both our state and our updater function (setOrder) via context
  // const [order, setOrder] = useState([]);
  const [order, setOrder] = useContext(OrderContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 2. make function to add things to order
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }
  // 3. make a function to remove things from order
  function removeFromOrder(index) {
    setOrder([
      // everything before the item we want to remove
      ...order.slice(0, index),
      // everything after item we want to remove
      ...order.slice(index + 1),
    ]);
  }

  // this function is run when someone submits form
  async function submitOrder(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // setMessage('Go Eat!');

    // gather all data
    const body = {
      order: attachNamesAndPrices(order, pizzas),
      total: formatMoney(calculateOrderTotal(order, pizzas)),
      name: values.name,
      email: values.email,
      mapleSyrup: values.mapleSyrup,
    };
    console.log(body);
    // 4. send this data to a serverless function when they check out
    const res = await fetch(
      `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    const text = JSON.parse(await res.text());

    // check if everything worked
    if (res.status >= 400 && res.status < 600) {
      setLoading(false); // turn off loading
      setError(text.message);
    } else {
      // it worked
      setLoading(false);
      setMessage('Success! Come on down for your pizza');
    }
  }

  return {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  };
}
