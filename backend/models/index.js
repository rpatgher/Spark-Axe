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
import Feature from "./Feature.js";
import WebsiteFeature from "./WebsiteFeature.js";


User.hasMany(Website, { foreignKey: 'user_id', onDelete: 'RESTRICT' });
Website.belongsTo(User, { foreignKey: 'user_id', onDelete: 'RESTRICT' });
Element.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Website.hasMany(Element, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Category.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Website.hasMany(Category, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Website.hasOne(Inventory, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Inventory.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Subcategory.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'RESTRICT' });
Category.hasMany(Subcategory, { foreignKey: 'category_id', onDelete: 'RESTRICT' });
Subcategory.belongsToMany(Element, { through: ElementCategory, onDelete: 'RESTRICT' });
Element.belongsToMany(Subcategory, { through: ElementCategory, onDelete: 'RESTRICT' });
Order.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Website.hasMany(Order, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Element.belongsToMany(Order, { through: OrderElement, onDelete: 'RESTRICT' });
Order.belongsToMany(Element, { through: OrderElement, onDelete: 'RESTRICT' });
OrderElement.belongsTo(Order, { foreignKey: 'orderId', onDelete: 'RESTRICT' });
OrderElement.belongsTo(Element, { foreignKey: 'elementId', onDelete: 'RESTRICT' });
Customer.hasMany(Order, { foreignKey: 'customer_id', onDelete: 'RESTRICT' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', onDelete: 'RESTRICT' });
Website.hasMany(Customer, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Customer.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Website.belongsToMany(Feature, { through: WebsiteFeature, onDelete: 'RESTRICT' });
Feature.belongsToMany(Website, { through: WebsiteFeature, onDelete: 'RESTRICT' });

//deliveries has one website
//alrevez website.hasOne(deliveries)

// Customer.belongsTo(Website, { foreignKey: 'website_id' });

//belongs to hace que alla una foreign key que hace para exportar los registros de muchas tabla
//en tablas siempre va estar el uno en la tbla de muchos
export { User, Website, Element, Customer, Order, Category, Subcategory, ElementCategory, OrderElement, Inventory, Feature, WebsiteFeature };