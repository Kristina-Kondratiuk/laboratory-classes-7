const { getDatabase } = require('../database');

const COLLECTION_NAME = 'products';

class Product {
  constructor(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
  }

  async save() {
    const db = getDatabase();

    const existing = await db
      .collection(COLLECTION_NAME)
      .findOne({ name: this.name });

    if (existing) {
      throw new Error(`Product "${this.name}" already exists`);
    }

    await db.collection(COLLECTION_NAME).insertOne({
      name: this.name,
      description: this.description,
      price: this.price
    });
  }

  static async getAll() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).find().toArray();
  }

  static async add(product) {
    const db = getDatabase();

    const existing = await db
      .collection(COLLECTION_NAME)
      .findOne({ name: product.name });

    if (existing) {
      throw new Error(`Product "${product.name}" already exists`);
    }

    await db.collection(COLLECTION_NAME).insertOne(product);
  }

  static async findByName(name) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ name });
  }

  static async deleteByName(name) {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).deleteOne({ name });
  }

  static async getLast() {
    const db = getDatabase();
    const products = await db.collection(COLLECTION_NAME)
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    return products[0];
  }
}

module.exports = Product;