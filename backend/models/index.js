import User from "./User.js";
import Website from "./Website.js";
import Customer from "./Customer.js";
import Order from "./Order.js";
import Element from "./Element.js";
import Category from "./Category.js";
import Subcategory from "./Subcategory.js";
import ElementCategory from "./ElementCategory.js";
import OrderElement from "./OrderElement.js";
import Inventory from "./Inventory.js";


User.hasMany(Website, { foreignKey: 'user_id' });
Website.belongsTo(User, { foreignKey: 'user_id' });
Element.belongsTo(Website, { foreignKey: 'website_id' });
Category.belongsTo(Website, { foreignKey: 'website_id' });
Website.hasMany(Category, { foreignKey: 'website_id' });
Website.hasOne(Inventory, { foreignKey: 'website_id' });
Inventory.belongsTo(Website, { foreignKey: 'website_id' });
Subcategory.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Subcategory, { foreignKey: 'category_id' });
Subcategory.belongsToMany(Element, { through: ElementCategory });
Element.belongsToMany(Subcategory, { through: ElementCategory });
Order.belongsTo(Website, { foreignKey: 'website_id' });
Element.belongsToMany(Order, { through: OrderElement });
Order.belongsToMany(Element, { through: OrderElement });
Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });
Website.hasMany(Customer, { foreignKey: 'website_id' });
Customer.belongsTo(Website, { foreignKey: 'website_id' });

//deliveries has one website
//alrevez website.hasOne(deliveries)

// Customer.belongsTo(Website, { foreignKey: 'website_id' });

//belongs to hace que alla una foreign key que hace para exportar los registros de muchas tabla
//en tablas siempre va estar el uno en la tbla de muchos
export { User, Website, Element, Customer, Order, Category, Subcategory, ElementCategory, OrderElement, Inventory };