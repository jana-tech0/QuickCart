export const calcPrices = (orderItems) => {

    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
  
    
    const taxRate = 0.1;
    const taxPrice = parseFloat((itemsPrice * taxRate).toFixed(2));
  
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
  
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
  
    return { itemsPrice, taxPrice, shippingPrice, totalPrice };
};
  