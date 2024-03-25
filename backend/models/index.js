import User from "./User.js";
import Website from "./Website.js";
import Customer from "./Customer.js";
import Order from "./Order.js";
import Element from "./Element.js";


User.hasMany(Website, { foreignKey: 'user_id' });
Website.belongsTo(User, { foreignKey: 'user_id' });


// Order.belongsToMany(Element, { through: 'order_element' });
// Element.belongsToMany(Order, { through: 'order_element' });
// Customer.belongsTo(Website, { foreignKey: 'website_id' });
// Element.belongsTo(Website, { foreignKey: 'website_id' });


export { User, Website, Element, Customer, Order};