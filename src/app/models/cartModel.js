class Cart {
  constructor(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id, qty) {
      let storedItem = this.items[id];
      if (!storedItem) {
        storedItem = this.items[id] = { item: item, qty: Number(qty), price: 0 };
      }
      if (!qty) {
        storedItem.qty++;
      }
      console.log(storedItem);
      storedItem.price = storedItem.item.price * Number(storedItem?.qty);
      this.totalQty += storedItem.qty;
      this.totalPrice += storedItem.price;
    };

    this.refreshCart = function () {
      this.items = {};
      this.totalPrice = 0;
      this.totalQty = 0;
    };

    this.reduceByOne = function (id) {
      this.items[id].qty--;
      this.items[id].price -= this.items[id].item.price;
      this.totalQty--;
      this.totalPrice -= this.items[id].item.price;

      if (this.items[id].qty <= 0) {
        delete this.items[id];
      }
    };

    this.removeItem = function (id) {
      this.totalQty -= this.items[id].qty;
      this.totalPrice -= this.items[id].price;
      delete this.items[id];
    };

    this.generateArray = function () {
      let arr = [];
      for (let id in this.items) {
        arr.push(this.items[id]);
      }
      return arr;
    };
  }
}

export { Cart };
