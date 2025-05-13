const { getDatabase } = require('../database');
const Product = require('./Product');

const COLLECTION_NAME = 'carts';

class Cart {
  static async add(productName) {
    const db = getDatabase();

    const product = await Product.findByName(productName);
    if (!product) {
      throw new Error(`Product '${productName}' not found.`);
    }

    const existingItem = await db.collection(COLLECTION_NAME).findOne({ name: productName });

    if (existingItem) {
      await db.collection(COLLECTION_NAME).updateOne(
        { name: productName },
        { $inc: { quantity: 1 } }
      );
    } else {
      await db.collection(COLLECTION_NAME).insertOne({
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
  }

  static async getItems() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).find().toArray();
  }

  static async getProductsQuantity() {
    const db = getDatabase();
    const items = await db.collection(COLLECTION_NAME).find().toArray();

    return items.reduce((total, item) => total + item.quantity, 0);
  }

  static async getTotalPrice() {
    const db = getDatabase();
    const items = await db.collection(COLLECTION_NAME).find().toArray();

    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  static async clearCart() {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).deleteMany({});
  }
}

module.exports = Cart;
