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
import Section from "./Section.js";
import Advertisement from "./Advertisement.js";
import Contact from "./Contact.js";
import PoS from "./PoS.js";
import PoSCategory from "./PoSCategory.js";


import Config from "./Config.js";
import ElementProperty from "./ElementProperty.js";
import ElementConfigProperty from "./ElementConfigProperty.js";
import PoSProperty from "./PoSProperty.js";
import PoSConfigProperty from "./PoSConfigProperty.js";


User.hasMany(Website, { foreignKey: 'user_id', onDelete: 'RESTRICT' });
Website.belongsTo(User, { foreignKey: 'user_id', onDelete: 'RESTRICT' });
Element.belongsTo(Website, { foreignKey: 'website_id'});
Website.hasMany(Element, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Category.belongsTo(Website, { foreignKey: 'website_id'});
Website.hasMany(Category, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Website.hasOne(Inventory, { foreignKey: 'website_id', onDelete: 'CASCADE' });
Inventory.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Category.hasMany(Subcategory, { foreignKey: 'category_id', onDelete: 'CASCADE' });
Subcategory.belongsTo(Category, { foreignKey: 'category_id'});


Subcategory.belongsToMany(Element, { through: ElementCategory, onDelete: 'RESTRICT' });
Element.belongsToMany(Subcategory, { through: ElementCategory, onDelete: 'CASCADE' });

ElementCategory.belongsTo(Subcategory, { foreignKey: 'subcategoryId' });
ElementCategory.belongsTo(Element, { foreignKey: 'elementId' });


Order.belongsTo(Website, { foreignKey: 'website_id' });
Website.hasMany(Order, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Element.belongsToMany(Order, { through: OrderElement, onDelete: 'RESTRICT' });
Order.belongsToMany(Element, { through: OrderElement, onDelete: 'RESTRICT' });
OrderElement.belongsTo(Order, { foreignKey: 'orderId', onDelete: 'RESTRICT' });
OrderElement.belongsTo(Element, { foreignKey: 'elementId', onDelete: 'RESTRICT' });
Customer.hasMany(Order, { foreignKey: 'customer_id', onDelete: 'RESTRICT' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', onDelete: 'RESTRICT' });
Website.hasMany(Customer, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Customer.belongsTo(Website, { foreignKey: 'website_id' });
Website.belongsToMany(Feature, { through: WebsiteFeature, onDelete: 'RESTRICT' });
Feature.belongsToMany(Website, { through: WebsiteFeature });


Website.hasMany(Section, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Section.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Section.hasMany(Advertisement, { foreignKey: 'section_id', onDelete: 'RESTRICT' });
Advertisement.belongsTo(Section, { foreignKey: 'section_id', onDelete: 'RESTRICT' });

Customer.hasMany(Contact, { foreignKey: 'customer_id', onDelete: 'RESTRICT', allowNull: true });
Contact.belongsTo(Customer, { foreignKey: 'customer_id', onDelete: 'RESTRICT' });

Contact.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Website.hasMany(Contact, { foreignKey: 'website_id', onDelete: 'RESTRICT' });

PoS.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Website.hasMany(PoS, { foreignKey: 'website_id', onDelete: 'RESTRICT' });

Website.hasMany(PoSCategory, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
PoSCategory.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
PoSCategory.hasMany(PoS, { foreignKey: 'pos_category_id', onDelete: 'RESTRICT' });
PoS.belongsTo(PoSCategory, { foreignKey: 'pos_category_id', onDelete: 'RESTRICT' });



// ****************+ Configuration for the website +****************
Config.belongsTo(Website, { foreignKey: 'website_id', onDelete: 'RESTRICT' });
Website.hasMany(Config, { foreignKey: 'website_id', onDelete: 'RESTRICT' });

ElementProperty.belongsToMany(Config, { through: ElementConfigProperty, onDelete: 'RESTRICT' });
Config.belongsToMany(ElementProperty, { through: ElementConfigProperty, onDelete: 'RESTRICT' });

PoSProperty.belongsToMany(Config, { through: PoSConfigProperty, onDelete: 'RESTRICT' });
Config.belongsToMany(PoSProperty, { through: PoSConfigProperty, onDelete: 'RESTRICT' });






//deliveries has one website
//alrevez website.hasOne(deliveries)

// Customer.belongsTo(Website, { foreignKey: 'website_id' });

//belongs to hace que alla una foreign key que hace para exportar los registros de muchas tabla
//en tablas siempre va estar el uno en la tbla de muchos

export { 
    User, 
    Website, 
    Element, 
    Customer, 
    Order, 
    Category, 
    Subcategory, 
    ElementCategory, 
    OrderElement, 
    Inventory, 
    Feature, 
    WebsiteFeature, 
    Section, 
    Advertisement,
    Contact,
    PoS,
    PoSCategory,
    Config,
    ElementConfigProperty,
    ElementProperty,
    PoSProperty,
    PoSConfigProperty
};