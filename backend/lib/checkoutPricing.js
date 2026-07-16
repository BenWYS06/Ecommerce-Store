export const getEffectivePrice = (product) =>
  product.discountPrice > 0 ? product.discountPrice : product.price;

export const calculateSubtotalAmount = (products) =>
  products.reduce((subtotal, product) => {
    const amount = Math.round(getEffectivePrice(product) * 100);
    const quantity = product.quantity || 1;

    return subtotal + amount * quantity;
  }, 0);

export const calculateDiscountAmount = (
  subtotalAmount,
  discountPercentage = 0,
) => Math.round((subtotalAmount * discountPercentage) / 100);
